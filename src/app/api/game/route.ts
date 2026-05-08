export const runtime = "edge";
import { NextResponse } from "next/server";

const API_URL = process.env.API_SERVER_URL;
const API_KEY = process.env.API_SECRET_KEY!;

async function parseApiResponse(apiRes: Response) {
  const text = await apiRes.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: `API server returned ${apiRes.status} ${apiRes.statusText || "non-JSON response"}`,
      detail: text.slice(0, 180),
    };
  }
}

//
// GET /api/game  → lấy danh sách game
//
export async function GET() {
  try {
    const apiRes = await fetch(`${API_URL}/web/games`, {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    const data = await parseApiResponse(apiRes);
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

//
// POST /api/game  → tạo game mới
//
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Body sẽ chứa các fields:
    // {
    //   name: string,
    //   slug: string,
    //   url: string,
    //   googlePlayUrl?: string,
    //   appStoreUrl?: string,
    //   banner: string,
    //   logo: string,
    //   description: string,
    //   status: "active" | "inactive",
    //   categories: string[],
    //   tags: string[]
    // }

    const apiRes = await fetch(`${API_URL}/web/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY, 
      },
      body: JSON.stringify(body),
    });

    const data = await parseApiResponse(apiRes);
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
