import { Button, Card, Input } from "antd";
import Meta from "antd/es/card/Meta";
import { CommentType, ImageType } from "../interfaces/entity.types";
import { useState } from "react";
import { httpClient } from "../http.service";

export function ImageCard(props: Readonly<{ data: ImageType }>) {
  const { image_base64, comments, created_at, id } = props.data;
  const [commentInput, setCommentInput] = useState("");

  async function handleCommentSubmit() {
    const result = await httpClient.post<CommentType>("/api/comments", {
      imageId: id,
      content: commentInput,
    });
    if (result) {
      comments.unshift(result);
    }
    setCommentInput("");
  }

  return (
    <Card
      hoverable
      cover={
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`data:image/png;base64,${image_base64}`} alt="Uploaded" />
      }
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
              <Button type="primary" onClick={handleCommentSubmit}>
                Submit
              </Button>
            </div>
          </div>
        }
      />
    </Card>
  );
}
