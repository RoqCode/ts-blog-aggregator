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
import { loggedIn } from "./middleware/loggedIn";

async function main() {
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerListUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "addfeed", loggedIn(handlerAddFeed));
  registerCommand(commandsRegistry, "feeds", handlerListFeeds);
  registerCommand(commandsRegistry, "follow", loggedIn(handlerFollowFeed));
  registerCommand(
    commandsRegistry,
    "following",
    loggedIn(handlerGetFeedFollows),
  );

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
