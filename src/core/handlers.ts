import { getUser, createUser, listUsers } from "src/lib/db/queries/users";
import { CommandHandler } from "./commandHandler";
import { readConfig, setUser } from "./config";
import { resetDB } from "src/lib/db/queries/resetDB";

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
