import { z } from "zod";

export const serverEnvSchema = z.object({
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string(),
	ALLOWED_DOMAIN: z.string(),
	ARCJET_KEY: z.string(),
	PEPPER: z.string(),
});
