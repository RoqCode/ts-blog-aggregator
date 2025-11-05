import { resetDB } from "src/lib/db/queries/resetDB";
import { createUser, getUser, listUsers } from "src/lib/db/queries/users";
import { CommandHandler } from "./commandHandler";
import { readConfig, setUser } from "./config";
import { fetchFeed } from "src/lib/utils/fetchFeed";
import { createFeed } from "src/lib/utils/createFeed";
import { printFeed } from "src/lib/utils/printFeed";

export const handlerLogin: CommandHandler = async (_cmdName, ...args) => {
  if (!args?.length) {
    console.error("login needs a user name");
    process.exit(1);
  }

  const userName = args[0];

  const user = await getUser(userName);
  if (!user) {
    console.error(
      `user "${userName}" does not exist. please register as a new user`,
    );
    process.exit(1);
  }

  setUser(userName);
  console.log(`User has been set to: ${userName}`);
};

export const handlerRegister: CommandHandler = async (_cmdName, ...args) => {
  if (!args?.length) {
    console.error("register needs a user name");
    process.exit(1);
  }

  const userName = args[0];

  const user = await getUser(userName);

  if (user) {
    console.error(`user "${user.name}" already exists`);
    process.exit(1);
  }

  const newUser = await createUser(userName);
  setUser(newUser.name);
  console.log(`${newUser.name} has been registered as a new user`);
};

export const handlerReset: CommandHandler = async () => {
  try {
    await resetDB();
    console.log("reset complete. have a nice day :)");
    process.exit(0);
  } catch (e) {
    console.error("reset failed: ", e);
    process.exit(1);
  }
};

export const handlerListUsers: CommandHandler = async () => {
  try {
    const allUsers = await listUsers();
    const activeUser = readConfig().current_user_name ?? null;
    for (const user of allUsers) {
      console.log(
        `* ${user.name}${activeUser === user.name ? " (current)" : ""}`,
      );
    }
    process.exit(0);
  } catch (e) {
    console.error("listing users failed:", e);
    process.exit(1);
  }
};

export const handerAgg: CommandHandler = async () => {
  try {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(feed);
    process.exit(0);
  } catch (e) {
    console.error("fetching RSS Feed failed:", e);
    process.exit(1);
  }
};

export const handerAddFeed: CommandHandler = async (_cmdName, ...args) => {
  if (args?.length !== 2) {
    console.error("please provide a name and a url");
    process.exit(1);
  }

  const allUsers = await listUsers();
  if (!allUsers?.length) {
    console.error("no users found. please register as a new user");
    process.exit(1);
  }

  const activeUserName = readConfig().current_user_name ?? null;
  if (!activeUserName) {
    console.error("no active user set in config. please login");
    process.exit(1);
  }

  const activeUser = allUsers.find((user) => user.name === activeUserName);
  if (!activeUser?.id) {
    console.error("config mismatch. active user not found in data base");
    process.exit(1);
  }

  const name = args[0];
  const url = args[1];

  try {
    const feed = await createFeed(url, name, activeUser?.id);
    await printFeed(feed, activeUser);
    process.exit(0);
  } catch (e) {
    console.error("fetching RSS Feed failed:", e);
    process.exit(1);
  }
};
