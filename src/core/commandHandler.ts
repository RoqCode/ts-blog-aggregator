import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export const handlerLogin: CommandHandler = (_cmdName, ...args) => {
  if (!args?.length) {
    console.error("login needs a user name");
    process.exit(1);
  }

  const userName = args[0];

  setUser(userName);
  console.log(`User has been set to: ${userName}`);
};

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];

  if (!handler) {
    console.error(`command ${cmdName} does not exist`);
    process.exit(1);
  }

  handler(cmdName, ...args);
}
