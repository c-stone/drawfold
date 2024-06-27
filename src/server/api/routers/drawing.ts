import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const drawingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.drawing.create({
        data: {
          title: input.title,
          content: input.content,
          creator: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.drawing.findFirst({
      orderBy: { createdAt: "desc" },
      where: { creatorId: ctx.session.user.id },
    });
  }),

  // You can add more procedures here as needed
});