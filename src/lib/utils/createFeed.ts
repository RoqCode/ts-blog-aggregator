import { db } from "../db";
import { User } from "../db/queries/users";
import { feeds } from "../db/schema";
import { createFeedFollow } from "./createFeedFollow";

export type Feed = typeof feeds.$inferSelect;

export async function createFeed(
  url: string,
  name: string,
  user: User,
): Promise<Feed> {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, user_id: user.id })
    .returning();

  const feedFollow = await createFeedFollow(user.id, result.id);

  console.log(`Created Feed "${feedFollow.feedName}" for user "${user.name}" and started following it.`)

  return result;
}
