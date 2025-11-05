import { db } from "../db";
import { getUserById } from "../db/queries/users";
import { feeds } from "../db/schema";

export async function listFeeds() {
  const rows = await db
    .select({ name: feeds.name, url: feeds.url, userId: feeds.user_id })
    .from(feeds);

  if (!rows?.length) {
    console.error("no feeds found. please register some feeds");
    process.exit(1);
  }

  const feedsWithResolvedUserNames = await Promise.all(
    rows.map(async (row) => {
      const user = await getUserById(row.userId);
      return { ...row, userName: user.name };
    }),
  );

  console.log("Listing all RSSFeeds present in local database:");
  for (let i = 0; i < feedsWithResolvedUserNames.length; i++) {
    const feed = feedsWithResolvedUserNames[i];
    console.log(
      `${i + 1}.: Name: "${feed.name}", URL: "${feed.url}", Indexed by user: "${feed.userName}"`,
    );
  }
}
