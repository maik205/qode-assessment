import { NextResponse } from "next/server";
import { IApiResponse } from "@/app/interfaces/api.response";
import { Image, Comment } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
export async function GET(): Promise<
  NextResponse<IApiResponse<(Image & { comments: Comment[] })[]>>
> {
  try {
    const images = await prisma.image.findMany({
      include: { comments: true },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({
      data: images,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<IApiResponse<Image & { comments: Comment[] }>>> {
  try {
    const body = await request.json();
    const { image_base64 } = body || {};

    if (!image_base64 || typeof image_base64 !== "string") {
      return NextResponse.json(
        { data: null, error: "image_base64 is required" },
        { status: 400 }
      );
    }

    const created = await prisma.image.create({
      data: {
        image_base64,
      },
      include: { comments: true },
    });

    return NextResponse.json({ data: created, error: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: String(error) },
      { status: 500 }
    );
  }
}
