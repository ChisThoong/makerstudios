export const runtime = "edge";
import { NextResponse } from "next/server";

const API_URL = process.env.API_SERVER_URL;
const API_KEY = process.env.API_SECRET_KEY!;

// GET /api/blog/:id - Get single post
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const apiRes = await fetch(`${API_URL}/web/posts/${id}`, {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    if (!apiRes.ok) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const data = await apiRes.json();
    
    // Return the data as-is, transformation will happen in the page component
    return NextResponse.json(data, { status: 200 });
    
  } catch (err: any) {
    console.error("Error in GET /api/blog/[id]:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/:id - Update post
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const apiRes = await fetch(`${API_URL}/web/posts/${id}`, {
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
    console.error("Error in PUT /api/blog/[id]:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/:id - Delete post
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const apiRes = await fetch(`${API_URL}/web/posts/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": API_KEY,
      },
    });

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
    
  } catch (err: any) {
    console.error("Error in DELETE /api/blog/[id]:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}