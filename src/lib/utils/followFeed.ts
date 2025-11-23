import { createFeedFollow } from "./createFeedFollow";
import { db } from "../db";
import { feeds } from "../db/schema";
import { User } from "../db/queries/users";

export async function followFeed(url: string, activeUser: User) {
  // get feedId by url
  const allFeeds = await db
    .select({ name: feeds.name, url: feeds.url, id: feeds.id })
    .from(feeds);

  if (!allFeeds?.length) {
    console.error("no feeds found. please register some feeds");
    process.exit(1);
  }

  const foundFeed = allFeeds.find((feed) => url === feed.url);

  if (!foundFeed) {
    console.error("no feed with this url found. please register it before trying to follow it");
    process.exit(1);
  }

  try {
    const response = await createFeedFollow(activeUser.id, foundFeed.id);
    console.log(`User: "${response.userName}" is now following feed: "${response.feedName}"`)
  } catch (e) {
    console.error("something went wrong while trying to create a feed follow:", e);
    process.exit(1);
  }
}
