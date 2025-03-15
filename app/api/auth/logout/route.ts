import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
	console.log("Logging out");
	const cookie = serialize("token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		expires: new Date(0),
	});

	const response = NextResponse.json({ message: "Logged out" });
	response.headers.set("Set-Cookie", cookie);

	return response;
}
