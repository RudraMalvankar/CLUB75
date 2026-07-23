import type { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  schema: "./database/schema/index.ts",
  out: "./database/migrations",
} satisfies Config;
