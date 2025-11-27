import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("funcionarios", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should list funcionarios", async () => {
    const result = await caller.funcionarios.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a funcionario", async () => {
    const result = await caller.funcionarios.create({
      nome: "João Silva",
      valor_contribuicao: 10000, // R$ 100,00
      status: "Pendente",
    });
    expect(result).toBeDefined();
  });

  it("should validate funcionario input", async () => {
    try {
      await caller.funcionarios.create({
        nome: "",
        valor_contribuicao: -100,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });
});

describe("despesas", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should list despesas", async () => {
    const result = await caller.despesas.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a despesa", async () => {
    const today = new Date().toISOString().split("T")[0];
    const result = await caller.despesas.create({
      item: "Buffet",
      valor: 50000, // R$ 500,00
      data_compra: today,
    });
    expect(result).toBeDefined();
  });

  it("should validate despesa input", async () => {
    try {
      await caller.despesas.create({
        item: "",
        valor: -100,
        data_compra: "invalid-date",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("should validate date format", async () => {
    try {
      await caller.despesas.create({
        item: "Teste",
        valor: 10000,
        data_compra: "2024/01/01", // Wrong format
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });
});
