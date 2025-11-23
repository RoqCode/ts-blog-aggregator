import { CommandHandler } from "src/core/commandHandler";
import { readConfig } from "src/core/config";
import { listUsers, User } from "src/lib/db/queries/users";

type MiddlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;
export type UserCommandHandler = (
  user: User,
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export const loggedIn: MiddlewareLoggedIn = (handler: UserCommandHandler) => {
  return async (...args) => {
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
    return handler(activeUser, ...args);
  };
};
