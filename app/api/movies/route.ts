import { type NextRequest, NextResponse } from "next/server";
import { movies } from "@/db/schema";
import { db } from "@/db/drizzle";
import type { NewMovie } from "@/schemas/schema";

export async function GET() {
	const result = await db.select().from(movies);
	return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
	const userId = request.headers.get("x-user-id");
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body: NewMovie = await request.json();
	await db.insert(movies).values({ ...body, userId: userId });

	return NextResponse.json({ success: true });
}
