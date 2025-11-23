import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./core/commandHandler";
import {
  handlerAddFeed,
  handlerAgg,
  handlerFollowFeed,
  handlerGetFeedFollows,
  handlerListFeeds,
  handlerListUsers,
  handlerLogin,
  handlerRegister,
  handlerReset,
} from "./core/handlers";

async function main() {
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerListUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "addfeed", handlerAddFeed);
  registerCommand(commandsRegistry, "feeds", handlerListFeeds);
  registerCommand(commandsRegistry, "follow", handlerFollowFeed);
  registerCommand(commandsRegistry, "following", handlerGetFeedFollows);

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
