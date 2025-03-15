import { type NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import type { UpdateUser } from "@/schemas/schema";
import { hashPassword, passwordController } from "@/utils/passwordManager";

type UserPayload = {
	id: string;
	email: string;
};

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const userId = (await params).id;
	const authUserId = request.headers.get("x-user-id");

	if (!authUserId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Ensure the user is updating their own profile
	if (authUserId !== userId) {
		return NextResponse.json(
			{ error: "You can only update your own account" },
			{ status: 403 },
		);
	}

	const body: UpdateUser = await request.json();
	const { password, firstName, lastName } = body;

	const userToUpdate = await db
		.select()
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);
	if (!userToUpdate.length || !userToUpdate[0].id) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	let userPassword = userToUpdate[0].password;

	if (password) {
		const passwordResult = passwordController(password);
		if (!passwordResult.isStrong) {
			return NextResponse.json(
				{ error: passwordResult.message },
				{ status: 400 },
			);
		}
		userPassword = hashPassword(password);
	}

	await db
		.update(users)
		.set({
			password: userPassword,
			firstName: firstName ?? userToUpdate[0].firstName,
			lastName: lastName ?? userToUpdate[0].lastName,
		})
		.where(eq(users.id, userId));

	return NextResponse.json({ success: true });
}
