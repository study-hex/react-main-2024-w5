import { Controller, useFormContext, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Plus, Minus } from "lucide-react";

import { useImageUpload } from "~/hooks/useImageUpload";
import ImagePreview from "../ImagePreview";

export default function ImageUrlInputs() {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imagesUrl",
    // #NOTES: 避免新增產品後，再次點選新增時，多圖欄位會跑出前次的資料
    shouldUnregister: true,
  });

  const { handleUpload: handleImageUpload } = useImageUpload((imageUrl) =>
    setValue(`imagesUrl.${fields.length - 1}`, imageUrl)
  );

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
                    onFileSelect={(file) => handleImageUpload(file)}
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
