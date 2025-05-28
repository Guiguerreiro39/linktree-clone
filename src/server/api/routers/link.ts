import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { link } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

export const linkRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const page = await ctx.db.query.page.findFirst({
      where: (page, { eq }) => eq(page.userId, ctx.userId),
    });

    if (!page) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Page not found",
      });
    }

    return await ctx.db.query.link.findMany({
      where: (link, { eq }) => eq(link.pageId, page.id),
      orderBy: (link, { asc }) => [asc(link.order)],
    });
  }),
  bulkDelete: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;

      const page = await ctx.db.query.page.findFirst({
        where: (page, { eq }) => eq(page.userId, ctx.userId),
      });

      if (!page) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }

      return await ctx.db
        .delete(link)
        .where(and(inArray(link.id, ids), eq(link.pageId, page.id)))
        .returning();
    }),
  bulkUpdate: protectedProcedure
    .input(
      z.object({
        links: z.array(
          z.object({
            id: z.string(),
            name: z.string().max(80).optional(),
            url: z.string().optional(),
            order: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { links } = input;

      const page = await ctx.db.query.page.findFirst({
        where: (page, { eq }) => eq(page.userId, ctx.userId),
      });

      if (!page) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }

      await ctx.db.transaction(async (tx) => {
        for (const item of links) {
          const result = await tx
            .update(link)
            .set({
              name: item.name,
              url: item.url,
              order: item.order,
            })
            .where(and(eq(link.id, item.id), eq(link.pageId, page.id)))
            .returning();

          if (result.length === 0) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Update failed for link id ${item.id}`,
            });
          }
        }
      });
    }),
  bulkCreate: protectedProcedure
    .input(
      z.object({
        links: z.array(
          z.object({
            name: z.string().max(80).optional(),
            url: z.string().optional(),
            order: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { links } = input;

      const page = await ctx.db.query.page.findFirst({
        where: (page, { eq }) => eq(page.userId, ctx.userId),
      });

      if (!page) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Page not found",
        });
      }

      return await ctx.db
        .insert(link)
        .values(
          links.map((link) => ({
            name: link.name,
            url: link.url,
            order: link.order,
            pageId: page.id,
          })),
        )
        .returning();
    }),
});
