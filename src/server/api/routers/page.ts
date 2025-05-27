import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { link, page } from "@/server/db/schema";
import { env } from "@/env";
import { supabase } from "@/lib/supabase/client";
import { TRPCError } from "@trpc/server";

export const pageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tag: z.string().min(1).max(30),
        bio: z.string().min(1).max(160),
        imageUrl: z.string().url().optional(),
        links: z.array(
          z.object({
            name: z.string().max(80).optional(),
            url: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pageResponse = await ctx.db
        .insert(page)
        .values({
          tag: input.tag,
          bio: input.bio,
          imageUrl: input.imageUrl,
          userId: ctx.userId,
        })
        .returning();

      if (!pageResponse[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create page",
        });
      }

      const pageId = pageResponse[0].id;

      await Promise.all(
        input.links.map((item, index) => {
          return ctx.db.insert(link).values({
            name: item.name,
            url: item.url,
            order: index,
            pageId,
          });
        }),
      );

      return pageResponse[0];
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.page.findFirst({
      where: (page, { eq }) => eq(page.userId, ctx.userId),
    });
  }),
  presignUpload: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileSize: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fileName, fileSize } = input;

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

      if (fileSize > MAX_FILE_SIZE) {
        throw new TRPCError({
          code: "PAYLOAD_TOO_LARGE",
          message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        });
      }

      const fileExt = fileName.split(".").pop();
      const uniqueFileName = `${ctx.userId}-${Date.now()}.${fileExt}`;

      try {
        const { data, error } = await supabase.storage
          .from(env.S3_BUCKET_NAME)
          .createSignedUploadUrl(uniqueFileName);

        if (error) throw error;

        return {
          presignedUrl: data.signedUrl,
          fileKey: uniqueFileName,
          filePath: data.path,
          token: data.token,
        };
      } catch (error) {
        console.error("Error creating pre-signed URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate upload URL",
        });
      }
    }),
  confirmUpload: protectedProcedure
    .input(
      z.object({
        fileKey: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { fileKey } = input;

      try {
        const { error } = await supabase.storage
          .from(env.S3_BUCKET_NAME)
          .download(fileKey);

        if (error) throw error;

        const { data } = supabase.storage
          .from(env.S3_BUCKET_NAME)
          .getPublicUrl(fileKey);

        return {
          publicUrl: data.publicUrl,
        };
      } catch (error) {
        console.error("Error confirming upload:", error);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Upload could not be confirmed",
        });
      }
    }),
});
