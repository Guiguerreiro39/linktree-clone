import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { page } from "@/server/db/schema";

export const pageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tag: z.string().min(1).max(30),
        bio: z.string().min(1).max(160),
        imageUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(page)
        .values({
          tag: input.tag,
          bio: input.bio,
          imageUrl: input.imageUrl,
          userId: ctx.userId,
        })
        .returning();
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.page.findFirst({
      where: (page, { eq }) => eq(page.userId, ctx.userId),
    });
  }),
});
