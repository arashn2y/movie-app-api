import { type NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sign } from "jsonwebtoken";
import { serverEnv } from "@/env/server";
import type { User } from "@/schemas/schema";
import { validatePassword } from "@/utils/passwordManager";
import { db } from "@/db/drizzle";

export async function POST(request: NextRequest) {
	const { email, password }: Omit<User, "id"> = await request.json();

	// Find user by email
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (!user.length || !user[0].password) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}

	// Verify password
	const passwordIsValid = validatePassword(password, user[0].password);
	if (!passwordIsValid) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}

	// Generate JWT token
	const token = sign({ id: user[0].id, email }, serverEnv.JWT_SECRET, {
		expiresIn: "8h",
	});

	return NextResponse.json({ token });
}
