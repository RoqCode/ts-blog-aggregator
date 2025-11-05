import { User } from "../db/queries/users";
import { Feed } from "./createFeed";
import { fetchFeed } from "./fetchFeed";

export async function printFeed(feedDbItem: Feed, user: User) {
  const feed = await fetchFeed(feedDbItem.url);

  console.log("Retrieving Feeds of user:", user.name);
  console.log(feed);
}
