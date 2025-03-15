import { type NextRequest, NextResponse } from "next/server";
import { movies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import type { UpdateMovie } from "@/schemas/schema";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const userId = request.headers.get("x-user-id");
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const id = (await params).id;
	const body: UpdateMovie = await request.json();

	// Check if the user owns the movie
	const movie = await db
		.select()
		.from(movies)
		.where(eq(movies.id, id))
		.limit(1);
	if (!movie.length || movie[0].userId !== userId) {
		return NextResponse.json(
			{ error: "You can only update your own movies" },
			{ status: 403 },
		);
	}

	await db.update(movies).set(body).where(eq(movies.id, id));
	return NextResponse.json({ success: true });
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const userId = request.headers.get("x-user-id");
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const id = (await params).id;

	// Check if the user owns the movie
	const movie = await db
		.select()
		.from(movies)
		.where(eq(movies.id, id))
		.limit(1);
	if (!movie.length || movie[0].userId !== userId) {
		return NextResponse.json(
			{ error: "You can only delete your own movies" },
			{ status: 403 },
		);
	}

	await db.delete(movies).where(eq(movies.id, id));
	return NextResponse.json({ success: true });
}
