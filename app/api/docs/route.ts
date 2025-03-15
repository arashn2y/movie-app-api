import { NextResponse } from "next/server";
import swaggerData from "./swagger.json";

export async function GET() {
	return NextResponse.json(swaggerData);
}
