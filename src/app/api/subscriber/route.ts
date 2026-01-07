export const runtime = "edge";

import { NextResponse } from "next/server";

const API_URL = process.env.API_SERVER_URL;
const API_KEY = process.env.API_SECRET_KEY!;

//
// GET /api/subscribers → lấy danh sách subscriber (có phân trang + search)
//
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";
    const search = searchParams.get("search") ?? "";

    const query = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    }).toString();

    const apiRes = await fetch(`${API_URL}/web/subscribers?${query}`, {
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
