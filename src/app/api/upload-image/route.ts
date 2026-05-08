export const runtime = "edge";

import { NextResponse } from "next/server";

const UPLOAD_SERVER_URL =
  process.env.UPLOAD_SERVER_URL || process.env.NEXT_PUBLIC_UPLOAD_SERVER_URL || "";
const UPLOAD_SERVER_KEY =
  process.env.UPLOAD_SERVER_KEY || process.env.NEXT_PUBLIC_UPLOAD_SERVER_KEY || "";

export async function POST(req: Request) {
  try {
    if (!UPLOAD_SERVER_URL) {
      return NextResponse.json(
        { success: false, message: "Missing upload server URL" },
        { status: 500 }
      );
    }

    const incoming = await req.formData();
    const file = incoming.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Image file is required" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const form = new FormData();
    form.append("file", file, file.name);

    const uploadRes = await fetch(`${UPLOAD_SERVER_URL.replace(/\/+$/, "")}/upload`, {
      method: "POST",
      headers: UPLOAD_SERVER_KEY ? { "x-api-key": UPLOAD_SERVER_KEY } : undefined,
      body: form,
    });

    const text = await uploadRes.text();
    let data: { url?: string; message?: string } = {};

    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!uploadRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || `Upload failed (${uploadRes.status})`,
        },
        { status: uploadRes.status }
      );
    }

    if (!data.url) {
      return NextResponse.json(
        { success: false, message: "Upload server did not return an image URL" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, url: data.url }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Unable to upload image",
      },
      { status: 500 }
    );
  }
}
