import { defineConfig } from "drizzle-kit";

import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  },
  tablesFilter: ["pet_*"],
});
