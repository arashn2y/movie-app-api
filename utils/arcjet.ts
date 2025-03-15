import { serverEnv } from "@/env/server";
import arcjet, { tokenBucket } from "@arcjet/next";

export const aj = arcjet({
	key: serverEnv.ARCJET_KEY,
	characteristics: ["ip.src"],
	rules: [
		tokenBucket({
			mode: "LIVE",
			refillRate: 5,
			interval: 10,
			capacity: 30,
		}),
	],
});
