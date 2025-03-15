import { type NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { serverEnv } from "@/env/server";
import type { User } from "@/schemas/schema";
import { validatePassword } from "@/utils/passwordManager";
import { db } from "@/db/drizzle";
import { serialize } from "cookie";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
	try {
		const { email, password }: Omit<User, "id"> = await request.json();

		// Find user by email
		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!user.length || !user[0].password) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		// Verify password
		const passwordIsValid = validatePassword(password, user[0].password);
		if (!passwordIsValid) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		// Generate JWT token
		const secret = new TextEncoder().encode(serverEnv.JWT_SECRET);
		const token = await new SignJWT({ id: user[0].id })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("8h")
			.sign(secret);

		// Set HttpOnly & Secure Cookie
		const cookie = serialize("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 8,
		});

		// Attach cookie to the response
		const response = NextResponse.json({ message: "Login successful" });
		response.headers.set("Set-Cookie", cookie);

		return response;
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json(
				{
					error: error.message.includes("JSON")
						? "Please provide a valid JSON body"
						: error.message,
				},
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 },
		);
	}
}
