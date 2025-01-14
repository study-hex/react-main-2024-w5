import { useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ImageIcon, X, Upload } from "lucide-react";

import { IMAGE_ACCEPT } from "~/constants";

type ImagePreviewPropsType = {
  url?: string;
  onRemove?: () => void;
  showRemove?: boolean;
  onFileSelect?: (file: File) => void;
  accept?: string;
};

export default function ImagePreview({
  url,
  onRemove,
  showRemove = false,
  onFileSelect,
  accept = IMAGE_ACCEPT,
}: ImagePreviewPropsType) {
  const [isError, setIsError] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile && onFileSelect) {
        onFileSelect(imageFile);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onFileSelect) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = accept;
    fileInput.onchange = (e) =>
      handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    fileInput.click();
  }, [accept, handleFileChange]);

  if (!url) {
    return (
      <Card
        className={`relative w-full h-48 ${
          isDragging ? "bg-amber-100/80" : "bg-amber-50/50"
        } 
          cursor-pointer transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className="flex items-center justify-center h-full p-4">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-amber-400" />
            <p className="mt-2 text-sm text-amber-600">
              {isDragging ? "放開以上傳圖片" : "點擊或拖曳圖片至此處上傳"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="relative w-full h-48 bg-red-50">
        <CardContent className="flex items-center justify-center h-full p-4">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-red-400" />
            <p className="mt-2 text-sm text-red-600">圖片載入失敗</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative w-full h-48 overflow-hidden group">
      <img
        src={url}
        alt="Preview"
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
        onError={() => setIsError(true)}
      />
      {showRemove && onRemove && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
