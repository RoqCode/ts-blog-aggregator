import z from "zod";
import fs from "fs";
import os from "os";
import path from "path";

export type Config = z.infer<typeof ConfigSchema>;

const ConfigSchema = z.object({
  db_url: z.string(),
  current_user_name: z.string().optional(),
});

export function setUser(userName: string) {
  try {
    const cfg = readConfig();
    cfg.current_user_name = userName;
    writeConfig(cfg);
  } catch (err) {
    throw err;
  }
}

export function readConfig(): Config {
  const rawConfig = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" });

  const config = validateConfig(rawConfig);

  if (!config) {
    throw new Error("invalid config");
  }

  return config;
}

function writeConfig(cfg: Config): void {
  fs.writeFileSync(getConfigFilePath(), JSON.stringify(cfg), {
    encoding: "utf-8",
  });
}

function validateConfig(rawConfig: any) {
  const parsed = JSON.parse(rawConfig);

  try {
    const config = ConfigSchema.parse(parsed);
    return config;
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("validation error", err);
    } else {
      throw err;
    }
  }
}

function getConfigFilePath() {
  return path.join(os.homedir(), ".gatorconfig.json");
}
