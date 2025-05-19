import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { link } from "@/server/db/schema";

export const linkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(256) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(link)
        .values({
          name: input.name,
          userId: ctx.userId,
        })
        .returning();
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.link.findMany({
      where: (link, { eq }) => eq(link.userId, ctx.userId),
    });
  }),
});
