import { createUser, getUser } from "src/lib/db/queries/users";
import { setUser } from "./config";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

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

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];

  if (!handler) {
    console.error(`command ${cmdName} does not exist`);
    process.exit(1);
  }

  await handler(cmdName, ...args);
}
