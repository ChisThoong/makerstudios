import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await cloudinary.uploader.upload_stream(
    { folder: "blog" },
    (err, result) => {
      if (err) throw err;
    }
  );

  const url = await new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) reject(err);
      else resolve(result?.secure_url!);
    });

    stream.end(buffer);
  });

  return NextResponse.json({ url });
}
