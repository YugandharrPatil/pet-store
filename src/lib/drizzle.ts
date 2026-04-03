import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

export const client = postgres(connectionString, {
	max: 1,
	prepare: false,
});

export const db = drizzle({ client });
