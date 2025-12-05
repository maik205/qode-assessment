export type CommentType = { id: string; content: string; created_at: Date };
export type ImageType = {
  id: string;
  image_base64: string;
  created_at: Date;
  comments: CommentType[];
};
