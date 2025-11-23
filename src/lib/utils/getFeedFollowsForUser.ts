import { eq } from "drizzle-orm";
import { db } from "../db";
import { feed_follows, users, feeds } from "../db/schema";
import { User } from "../db/queries/users";

export async function getFeedFollowsForUser(user: User) {
  const rows = await db
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
    .where(eq(feed_follows.user_id, user.id))

  console.log(`User "${user.name}" is following these feeds:`)
  for (const row of rows) {
    console.log(`- ${row.feedName}`)
  }
}
