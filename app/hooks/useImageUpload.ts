import { useCallback } from "react";

import { UPLOAD_LIMIT_SIZE } from "~/constants";

import { useToast } from "~/hooks/use-toast";
import { useUpload } from "~/service/upload";

export const useImageUpload = (onSuccess: (imageUrl: string) => void) => {
  const { toast } = useToast();
  const { trigger: triggerUpload } = useUpload();

  const handleUpload = useCallback(
    async (file: File) => {
      if (file.size > UPLOAD_LIMIT_SIZE) {
        toast({
          title: "檔案過大",
          description: "請選擇小於 3MB 的圖片",
        });
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      const response = await triggerUpload({ formData });
      onSuccess(String(response.imageUrl));
    },
    [onSuccess, toast, triggerUpload]
  );

  return { handleUpload };
};