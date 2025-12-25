export const runtime = 'edge';
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json(
      { success: true, message: "Logged out" },
      { status: 200 }
    );

    // Xóa cookie auth_token
    res.cookies.set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Xóa cookie
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
