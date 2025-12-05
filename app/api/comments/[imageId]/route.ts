import { IApiResponse } from "@/app/interfaces/api.response";
import { CommentType } from "@/app/interfaces/entity.types";
import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(
  request: NextApiRequest,
  { imageId }: { imageId: string }
): Promise<NextResponse<IApiResponse<CommentType[], unknown>>> {
  const comments = await prisma.comment.findMany({
    where: { image_id: imageId },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({ data: comments, error: null });
}
