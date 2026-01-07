export const runtime = "edge";
import { NextResponse } from "next/server";

const API_URL = process.env.API_SERVER_URL;
const API_KEY = process.env.API_SECRET_KEY!;

//
// GET /api/technology-stacks  → lấy danh sách technology stacks
//
export async function GET() {
  try {
    const apiRes = await fetch(`${API_URL}/web/technology-stacks`, {
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
// POST /api/technology-stacks  → tạo technology stack mới
//
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Body 
    // {
    //   id: number,
    //   name: string,
    //   imageUrl: string
    // }

    const apiRes = await fetch(`${API_URL}/web/technology-stacks`, {
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