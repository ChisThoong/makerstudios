export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_SERVER_URL!;
const API_KEY = process.env.API_SECRET_KEY!;

// GET - Fetch all jobs
export async function GET(req: NextRequest) {
  try {
    const apiRes = await fetch(`${API_URL}/web/jobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

// POST - Create new job
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await fetch(`${API_URL}/web/jobs`, {
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