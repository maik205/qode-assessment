/* eslint-disable @next/next/no-img-element */
"use client";

import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Input, Spin, Upload, UploadProps } from "antd";
import Meta from "antd/es/card/Meta";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IApiResponse } from "./interfaces/api.response";
import { httpClient } from "./http.service";
import { API_ROUTES } from "./routes";
import { fileToBase64 } from "./utils";
import { CommentType, ImageType } from "./interfaces/entity.types";
import { ImageCard } from "./components/image-card";

export default function Home() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const images = await httpClient.get<ImageType[]>(API_ROUTES.IMAGES);
      setImages(images || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const toUpload = file;
    setFile(null);

    try {
      const base64 = await fileToBase64(toUpload);
      const res = await httpClient.post<ImageType>(API_ROUTES.IMAGES, {
        image_base64: base64,
      });
      if (res) {
        setImages(images.unshift(res) ? [...images] : images);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function handleAddComment(imageId: string) {
    const content = (commentInputs[imageId] || "").trim();
    if (!content) return;
    try {
      await httpClient.post<CommentType>(API_ROUTES.COMMENTS, {
        imageId,
        content,
      });
      setCommentInputs((p) => ({ ...p, [imageId]: "" }));
      await fetchImages();
    } catch (err) {
      console.error(err);
    }
  }

  const uploadProps: UploadProps = {
    onChange(info) {
      const file = info.file.originFileObj;
      if (file) {
        setFile(file);
        handleUpload();
      }
    },
  };

  return (
    <div className="w-full flex justify-center h-full p-4">
      <div className="max-w-3xl gap-5 w-full flex flex-col items-center">
        <div className="w-full flex justify-between">
          <div className=""></div>
          <Upload {...uploadProps} showUploadList={false}>
            <Button
              disabled={uploading}
              icon={
                uploading ? (
                  <Spin indicator={<LoadingOutlined spin />} />
                ) : (
                  <UploadOutlined />
                )
              }
            >
              Upload your image
            </Button>
          </Upload>
        </div>
        <div>
          {images.length === 0 ? (
            <p>No images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img) => (
                <ImageCard key={img.id} data={img} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
