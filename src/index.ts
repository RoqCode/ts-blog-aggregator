import {
  CommandsRegistry,
  handlerLogin,
  registerCommand,
  runCommand,
} from "./core/commandHandler";

function main() {
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);

  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("not enough args provided");
    process.exit(1);
  }

  const cmd = args[0];
  const restArgs = args.slice(1);

  runCommand(commandsRegistry, cmd, ...restArgs);
}

main();
