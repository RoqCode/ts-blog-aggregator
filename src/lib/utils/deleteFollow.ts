import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { User } from "../db/queries/users";
import { feed_follows, feeds } from "../db/schema";

export async function deleteFollow(user: User, url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));

  if (!feed) {
    console.error(
      `could not find a feed with url "${url}". Register it first.`,
    );
  }

  try {
    await db
      .delete(feed_follows)
      .where(
        and(
          eq(feed_follows.feed_id, feed.id),
          eq(feed_follows.user_id, user.id),
        ),
      );
  } catch (e) {
    console.error("error while deleting follow:", e);
  }
}
