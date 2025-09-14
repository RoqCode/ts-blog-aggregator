import { readConfig, setUser } from "./config";

function main() {
  setUser("Roq");

  const cfg = readConfig();

  console.log("dbUrl:", cfg.db_url);
  console.log("currentUserName:", cfg.current_user_name);
}

main();
