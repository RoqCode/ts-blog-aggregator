import { db } from "..";
import { users } from "../schema";

export async function resetDB() {
  const allUsers = await db.select().from(users);

  await db.delete(users);

  console.log(`deleting ${allUsers.length} rows in users table... \ndone!`);
}
