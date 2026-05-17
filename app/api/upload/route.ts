import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<Response>((resolve) => {
      cloudinary.uploader
        .upload_stream({ folder: "lavender-umbra" }, (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            resolve(
              NextResponse.json({ error: "Upload failed" }, { status: 500 })
            );
          } else {
            resolve(NextResponse.json({ url: result?.secure_url }));
          }
        })
        .end(buffer);
    });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
