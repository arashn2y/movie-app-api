import { type NextRequest, NextResponse } from "next/server";
import { movies } from "@/db/schema";
import { db } from "@/db/drizzle";
import { newMovie, type NewMovie } from "@/schemas/schema";
import { ilike } from "drizzle-orm";

export async function GET() {
	const result = await db.select().from(movies);
	return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
	try {
		const userId = request.headers.get("x-user-id");
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { data, error } = newMovie.safeParse(body);

		if (error) {
			return NextResponse.json(
				{ error: "Please provide all required fields" },
				{ status: 406 },
			);
		}

		const movieExists = await db
			.select()
			.from(movies)
			.where(ilike(movies.title, `%${data.title.trim()}%`))
			.limit(1);

		if (movieExists.length) {
			return NextResponse.json(
				{ error: "Movie already exists" },
				{ status: 409 },
			);
		}

		await db.insert(movies).values({ ...data, userId: userId });

		return NextResponse.json({ success: true });
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
