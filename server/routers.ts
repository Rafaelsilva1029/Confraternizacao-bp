import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  funcionarios: router({
    list: publicProcedure.query(() => db.getAllFuncionarios()),
    create: publicProcedure
      .input(z.object({
        nome: z.string().min(1),
        valor_contribuicao: z.number().int().positive(),
        status: z.enum(["Pago", "Pendente", "Aguardando Alvará"]).optional(),
      }))
      .mutation(({ input }) =>
        db.createFuncionario({
          nome: input.nome,
          valor_contribuicao: input.valor_contribuicao,
          status: input.status || "Pendente",
        })
      ),
    update: publicProcedure
      .input(z.object({
        id: z.number().int(),
        nome: z.string().min(1).optional(),
        valor_contribuicao: z.number().int().positive().optional(),
        status: z.enum(["Pago", "Pendente", "Aguardando Alvará"]).optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateFuncionario(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => db.deleteFuncionario(input.id)),
  }),

  despesas: router({
    list: publicProcedure.query(() => db.getAllDespesas()),
    create: publicProcedure
      .input(z.object({
        item: z.string().min(1),
        valor: z.number().int().positive(),
        data_compra: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }))
      .mutation(({ input }) => db.createDespesa(input)),
    update: publicProcedure
      .input(z.object({
        id: z.number().int(),
        item: z.string().min(1).optional(),
        valor: z.number().int().positive().optional(),
        data_compra: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateDespesa(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => db.deleteDespesa(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
