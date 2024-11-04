import { NextRequest, NextResponse } from "next/server";
import { ImageService } from "@/core/services/ImageService";

export interface ImageUploadResponse {
  imageUrl: string;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File not found" }, { status: 400 });
  }
  const imageService = new ImageService(
    process.env.AZURE_STORAGE_CONNECTION_STRING as string,
  );
  try {
    const imageUrl = await imageService.uploadImage(file);
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image");
    console.error(error);
    return NextResponse.json(
      { message: "Error uploading image" },
      { status: 500 },
    );
  }
}
