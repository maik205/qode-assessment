import { IApiResponse } from "@/app/interfaces/api.response";
import { CommentType } from "@/app/interfaces/entity.types";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { imageId: string } | Promise<{ imageId: string }> }
): Promise<NextResponse<IApiResponse<CommentType[], unknown>>> {
  const comments = await prisma.comment.findMany({
    where: { image_id: (await params).imageId },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({ data: comments, error: null });
}
