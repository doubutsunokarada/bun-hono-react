import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "食費", amount: 50 },
  { id: 2, title: "交通費", amount: 100 },
  { id: 3, title: "書籍費", amount: 3000 },
];

export const expensesRoute = new Hono()
  .get("/", (c) => c.json({ expenses: fakeExpenses }))
  .post("/", zValidator("json", createPostSchema), (c) => {
    const expense = c.req.valid("json");
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    c.status(201);
    return c.json(expense);
  })
  .get("/total-spent", (c) => {
    const total = fakeExpenses.reduce((acc, e) => acc + e.amount, 0);
    return c.json({ total });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"), 10);
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"), 10);
    const index = fakeExpenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return c.notFound();
    }
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.notFound();
    }
    const deleted = fakeExpenses.splice(index, 1)[0];
    return c.json({ expense: deleted });
  });
// .put();
