import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import ImageUrlInputs from "@/features/product/components/ImageUrlInputs";
import ImagePreview from "@/features/product/components/ImagePreview";

import { useImageUpload } from "~/hooks/useImageUpload";

export default function ProductFormImage() {
  const { handleUpload } = useImageUpload((imageUrl) =>
    setValue("imageUrl", imageUrl)
  );

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label
                htmlFor="imageUrl"
                className="text-lg font-medium text-amber-800"
              >
                主要圖片
              </Label>
              <Input
                id="imageUrl"
                placeholder="輸入圖片網址"
                className="border-amber-200 focus:border-amber-400"
                {...field}
              />
              {errors.imageUrl && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200"
                >
                  <AlertDescription>
                    {String(errors.imageUrl.message)}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        />
        <ImagePreview
          url={watch("imageUrl")}
          onRemove={() => setValue("imageUrl", "")}
          showRemove={true}
          onFileSelect={handleUpload}
        />
      </div>

      <ImageUrlInputs />
    </div>
  );
}
