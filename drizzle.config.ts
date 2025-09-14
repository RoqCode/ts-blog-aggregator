import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/core/config";

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db/",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfig().db_url,
  },
});
