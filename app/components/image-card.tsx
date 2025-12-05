import { Button, Card, Input, Spin } from "antd";
import Meta from "antd/es/card/Meta";
import { CommentType, ImageType } from "../interfaces/entity.types";
import { useState } from "react";
import { httpClient } from "../http.service";
import { LoadingOutlined } from "@ant-design/icons";

export function ImageCard(props: Readonly<{ data: ImageType }>) {
  const { image_base64, comments, created_at, id } = props.data;
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCommentSubmit() {
    if (isSubmitting || !commentInput.trim()) return;
    setIsSubmitting(true);

    const result = await httpClient.post<CommentType>("/api/comments", {
      imageId: id,
      content: commentInput,
    });
    if (result) {
      comments.unshift(result);
    }
    setCommentInput("");
    setIsSubmitting(false);
  }

  return (
    <Card
      hoverable
      cover={
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`data:image/png;base64,${image_base64}`} alt="Uploaded" />
      }
      className="h-max"
    >
      <Meta
        title={`Uploaded at: ${new Date(created_at).toLocaleString()}`}
        description={
          <div>
            <div className="mb-2">
              <strong>Comments:</strong>
              {comments.length === 0 && <p>No comments yet.</p>}
              {comments.map((c) => (
                <p key={c.id}>
                  - {c.content} ({new Date(c.created_at).toLocaleString()})
                </p>
              ))}
            </div>
            <div className="w-full flex">
              <Input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onPressEnter={handleCommentSubmit}
              ></Input>
              <Button
                type="primary"
                onClick={handleCommentSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spin indicator={<LoadingOutlined spin />} />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        }
      />
    </Card>
  );
}
