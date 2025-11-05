import { eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "..";

export type User = typeof users.$inferSelect;

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
  if (!name) throw new Error("name required");
  const rows = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.name, name))
    .limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  if (!id) throw new Error("name required");
  const rows = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function listUsers(): Promise<User[]> {
  return await db.select().from(users);
}
