import { useState } from "react";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Plus, Minus, ImageIcon, X } from "lucide-react";

type ImagePreviewPropsType = {
  url: string;
  onRemove?: () => void;
  showRemove?: boolean;
};

export function ImagePreview({
  url,
  onRemove,
  showRemove = false,
}: ImagePreviewPropsType) {
  const [isError, setIsError] = useState(false);

  if (!url) {
    return (
      <Card className="relative w-full h-48 bg-amber-50/50">
        <CardContent className="flex items-center justify-center h-full p-4">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-amber-400" />
            <p className="mt-2 text-sm text-amber-600">尚未輸入圖片網址</p>
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

export default function ImageUrlInputs() {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imagesUrl",
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-medium text-amber-800">其他圖片</Label>
          <Button
            type="button"
            variant="outline"
            onClick={() => append("")}
            className="border-amber-200 text-amber-800 hover:bg-amber-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增圖片
          </Button>
        </div>

        <ScrollArea className="h-[360px] pr-4">
          <div className="grid grid-cols-1 gap-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 border-amber-200">
                <CardContent className="p-0 space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Controller
                        name={`imagesUrl.${index}`}
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={`imagesUrl.${index}`}
                              className="text-sm text-amber-800"
                            >
                              圖片網址 {index + 1}
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id={`imagesUrl.${index}`}
                                placeholder="輸入圖片網址"
                                className="flex-1 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => remove(index)}
                                className="border-amber-200 text-amber-800 hover:bg-amber-50"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>
                            {errors[`imagesUrl.${index}`] && (
                              <Alert variant="destructive" className="text-sm">
                                <AlertDescription>
                                  {String(
                                    errors[`imagesUrl.${index}`]?.message
                                  )}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <ImagePreview
                    url={watch(`imagesUrl.${index}`)}
                    onRemove={() => remove(index)}
                    showRemove={true}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
