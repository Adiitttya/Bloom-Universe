import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
