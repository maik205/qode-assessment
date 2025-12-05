/* eslint-disable @next/next/no-img-element */
"use client";

import Icon, {
  LoadingOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Spin, Upload, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { httpClient } from "./http.service";
import { API_ROUTES } from "./routes";
import { fileToBase64 } from "./utils";
import { ImageType } from "./interfaces/entity.types";
import { ImageCard } from "./components/image-card";

export default function Home() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  useEffect(() => {
    fetchImages();
  }, [reloadTrigger]);

  async function fetchImages() {
    try {
      setIsLoading(true);
      const images = await httpClient.get<ImageType[]>(API_ROUTES.IMAGES);
      setImages(images || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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
        <div className="w-full flex gap-2 justify-end">
          <Button
            className="ml-2"
            onClick={() =>
              setReloadTrigger((reloadTrigger) => reloadTrigger + 1)
            }
            disabled={isLoading}
          >
            <Icon component={ReloadOutlined} />
          </Button>
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
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Spin indicator={<LoadingOutlined spin />} />
              Loading images...
            </div>
          ) : images.length === 0 ? (
            <p>No images uploaded yet.</p>
          ) : (
            <div className="w-full flex gap-5 flex-wrap justify-center">
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
