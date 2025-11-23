import { db } from "../db";
import { eq } from "drizzle-orm";
import { feed_follows, feeds, users } from "../db/schema";

export type FeedFollow = typeof feed_follows.$inferSelect;

export async function createFeedFollow(
  userId: string,
  feedId: string
) {
  const [newFeedFollow] = await db
    .insert(feed_follows)
    .values({
      user_id: userId,
      feed_id: feedId,
    })
    .returning();

  const [row] = await db
    .select({
      id: feed_follows.id,
      createdAt: feed_follows.createdAt,
      updatedAt: feed_follows.updatedAt,
      userId: feed_follows.user_id,
      feedId: feed_follows.feed_id,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feed_follows)
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .where(eq(feed_follows.id, newFeedFollow.id));

  return row;
}
