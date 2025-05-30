import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { page, user } from "@/server/db/schema";
import { env } from "@/env";
import { supabase } from "@/lib/supabase/client";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import postgres from "postgres";

export const pageRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        tag: z
          .string()
          .min(1, { message: "Tag must be at least 1 character long" })
          .max(30, { message: "Tag must be at most 30 characters long" })
          .refine(
            (value) => {
              const isValid = /[^a-z0-9-]/g.test(value);
              if (!isValid) return true;

              return false;
            },
            {
              message:
                "Tag should contain only lowercase letters, numbers, and hyphens",
            },
          ),
        bio: z.string().max(160).optional(),
        imageUrl: z.union([z.string().url().optional(), z.literal("")]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .update(page)
          .set({
            tag: input.tag.toLowerCase(),
            bio: input.bio,
            imageUrl: input.imageUrl,
          })
          .where(eq(page.userId, ctx.user.id))
          .returning();

        return result[0];
      } catch (error) {
        // Check if it's a unique constraint violation
        if (error instanceof postgres.PostgresError && error.code === "23505") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tag already exists",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update page",
        });
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        tag: z
          .string()
          .min(1, { message: "Tag must be at least 1 character long" })
          .max(30, { message: "Tag must be at most 30 characters long" })
          .refine(
            (value) => {
              const isValid = /[^a-z0-9-]/g.test(value);
              if (!isValid) return true;

              return false;
            },
            {
              message:
                "Tag should contain only lowercase letters, numbers, and hyphens",
            },
          ),
        bio: z.string().max(160).optional(),
        imageUrl: z.union([z.string().url().optional(), z.literal("")]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.isOnboarded) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already onboarded",
        });
      }

      try {
        const result = await ctx.db
          .insert(page)
          .values({
            tag: input.tag.toLowerCase(),
            bio: input.bio,
            imageUrl: input.imageUrl,
            userId: ctx.user.id,
          })
          .returning();

        if (result[0]) {
          await ctx.db
            .update(user)
            .set({ isOnboarded: true })
            .where(eq(user.id, ctx.user.id));
        }

        return result[0];
      } catch (error) {
        // Check if it's a unique constraint violation
        if (error instanceof postgres.PostgresError && error.code === "23505") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tag already exists",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create page",
        });
      }
    }),
  getMyPage: protectedProcedure.query(async ({ ctx }) => {
    const response = await ctx.db.query.page.findFirst({
      where: (page, { eq }) => eq(page.userId, ctx.user.id),
    });

    if (!response) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Page not found",
      });
    }

    return response;
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
