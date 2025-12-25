export const runtime = "edge";
import { NextResponse } from "next/server";

const API_URL = process.env.API_SERVER_URL;
const API_KEY = process.env.API_SECRET_KEY!;

//
// GET /api/blog  → lấy danh sách bài viết
//
export async function GET() {
  try {
    const apiRes = await fetch(`${API_URL}/web/posts`, {
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

//
// POST /api/blog  → tạo bài viết
//
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Body sẽ chứa các fields:
    // {
    //   title: string,
    //   slug: string,
    //   content: string (HTML),
    //   excerpt: string,
    //   featuredImage: string,
    //   publishDate: string (ISO date),
    //   status: "draft" | "published",
    //   categories: string[],
    //   tags: string[],
    //   visibility: "public" | "private"
    // }

    const apiRes = await fetch(`${API_URL}/web/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY, 
      },
      body: JSON.stringify(body),
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