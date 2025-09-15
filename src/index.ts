import {
  CommandsRegistry,
  handlerLogin,
  handlerRegister,
  registerCommand,
  runCommand,
} from "./core/commandHandler";

async function main() {
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);

  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("not enough args provided");
    process.exit(1);
  }

  const cmd = args[0];
  const restArgs = args.slice(1);

  await runCommand(commandsRegistry, cmd, ...restArgs);

  process.exit(0);
}

main();
