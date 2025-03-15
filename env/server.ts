import type { ZodError } from "zod";
import { serverEnvSchema } from "./schema";

const result = serverEnvSchema.safeParse(process.env);

const errorHandler = (error: ZodError<typeof serverEnvSchema.setKey>) => {
	for (const issue of error.issues) {
		console.error(`${issue.path.join(".")} => ${issue.message}`);
	}
};

if (!result.success) {
	errorHandler(result.error);
	throw new Error(
		"Server environment variables are not valid, Please add the required environment variables in the .env file",
	);
}

export const serverEnv = result.data;
