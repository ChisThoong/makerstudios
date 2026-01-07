export const runtime = "edge";
import { NextResponse } from "next/server";

const API_URL = process.env.API_SERVER_URL;
const API_KEY = process.env.API_SECRET_KEY!;

//
// GET /api/technology-stacks/[id]  → lấy chi tiết một technology stack
//
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const apiRes = await fetch(`${API_URL}/web/technology-stacks/${id}`, {
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
// PUT /api/technology-stacks/[id]  → cập nhật technology stack
//
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Body có thể chứa các fields:
    // {
    //   id: number,  (để thay đổi thứ tự)
    //   name: string,
    //   imageUrl: string
    // }

    const apiRes = await fetch(`${API_URL}/web/technology-stacks/${id}`, {
      method: "PUT",
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

//
// DELETE /api/technology-stacks/[id]  → xóa technology stack
//
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const apiRes = await fetch(`${API_URL}/web/technology-stacks/${id}`, {
      method: "DELETE",
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