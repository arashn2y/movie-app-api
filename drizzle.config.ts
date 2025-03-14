import { serverEnv } from "@/env/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./db/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: serverEnv.DATABASE_URL,
	},
});
