export const runtime = "edge";
import { NextResponse } from "next/server";

const API_URL = process.env.API_SERVER_URL;
const API_KEY = process.env.API_SECRET_KEY!;

export async function GET() {
  try {
    const apiRes = await fetch(`${API_URL}/web/dashboard/games-stats`, {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}