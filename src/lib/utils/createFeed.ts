import { db } from "../db";
import { feeds } from "../db/schema";

export type Feed = typeof feeds.$inferSelect;

export async function createFeed(
  url: string,
  name: string,
  userId: string,
): Promise<Feed> {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, user_id: userId })
    .returning();

  return result;
}
