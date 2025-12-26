export const runtime = "edge";
import { NextResponse } from "next/server";

const API_URL = process.env.API_SERVER_URL;
const API_KEY = process.env.API_SECRET_KEY!;

// GET /api/game/:id - Get single game
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const apiRes = await fetch(`${API_URL}/web/games/${id}`, {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    if (!apiRes.ok) {
      return NextResponse.json(
        { success: false, message: "Game not found" },
        { status: 404 }
      );
    }

    const data = await apiRes.json();
    
    // Return the data as-is, transformation will happen in the page component
    return NextResponse.json(data, { status: 200 });
    
  } catch (err: any) {
    console.error("Error in GET /api/game/[id]:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/game/:id - Update game
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const apiRes = await fetch(`${API_URL}/web/games/${id}`, {
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
    console.error("Error in PUT /api/game/[id]:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/game/:id - Delete game
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const apiRes = await fetch(`${API_URL}/web/games/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": API_KEY,
      },
    });

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
    
  } catch (err: any) {
    console.error("Error in DELETE /api/game/[id]:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}