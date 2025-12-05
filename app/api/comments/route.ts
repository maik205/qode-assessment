import { IApiResponse } from "@/app/interfaces/api.response";
import { CommentType } from "@/app/interfaces/entity.types";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
): Promise<NextResponse<IApiResponse<CommentType, unknown>>> {
  try {
    const body = await request.json();
    const { imageId, content } = body || {};

    if (!imageId || typeof imageId !== "string") {
      return NextResponse.json(
        { data: null, error: "imageId is required" },
        { status: 400 }
      );
    }
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { data: null, error: "content is required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        image_id: imageId,
        content,
      },
    });

    return NextResponse.json(
      {
        data: comment,
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: null, error: String(error) },
      { status: 500 }
    );
  }
}
