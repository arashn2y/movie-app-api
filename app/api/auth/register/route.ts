import { type NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { serverEnv } from "@/env/server";
import { type NewUser, newUserSchema } from "@/schemas/schema";
import { hashPassword, passwordController } from "@/utils/passwordManager";
import { db } from "@/db/drizzle";

export async function POST(request: NextRequest) {
	const body: NewUser = await request.json();

	// Validate input with Zod schema
	const { data, error } = newUserSchema.safeParse(body);
	if (error) {
		return NextResponse.json(
			{ error: "Please provide all required fields" },
			{ status: 406 },
		);
	}

	const { email, password, firstName, lastName } = data;

	// Enforce allowed email domain
	if (!email.endsWith(`@${serverEnv.ALLOWED_DOMAIN}`)) {
		return NextResponse.json(
			{ error: "You can only register with your school email" },
			{ status: 400 },
		);
	}

	// Check if user already exists
	const userExists = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);
	if (userExists.length) {
		return NextResponse.json({ error: "User already exists" }, { status: 409 });
	}

	// Validate password strength
	const passwordIsStrong = passwordController(password);
	if (!passwordIsStrong.isStrong) {
		return NextResponse.json(
			{ error: passwordIsStrong.message },
			{ status: 400 },
		);
	}

	// Hash password and store user
	const hashedPassword = hashPassword(password);
	await db
		.insert(users)
		.values({ email, password: hashedPassword, firstName, lastName });

	return NextResponse.json({
		success: true,
		description: "User registered successfully",
	});
}
