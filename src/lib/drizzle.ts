import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

export const sql = postgres(connectionString, {
	max: 1,
	prepare: false,
});

export const db = drizzle(sql);
