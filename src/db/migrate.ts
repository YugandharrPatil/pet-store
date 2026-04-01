import { db, sql } from "@/lib/drizzle";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function main() {
	try {
		console.log("Starting migration...");
		await migrate(db, { migrationsFolder: "./supabase/migrations" });
		console.log("Migration completed safely.");
	} catch (error) {
		console.error("Migration failed:", error);
		process.exit(1);
	} finally {
		await sql.end();
	}
}

main();
