import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProductFormDescription() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-amber-800">簡短描述</Label>
            <Input
              placeholder="輸入簡短的產品描述"
              className="border-amber-200 focus:border-amber-400"
              {...field}
            />
            {errors.description && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>
                  {String(errors.description.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      />
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-amber-800">詳細內容</Label>
            <Input
              placeholder="輸入詳細的產品說明"
              className="border-amber-200 focus:border-amber-400"
              {...field}
            />
            {errors.content && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>
                  {String(errors.content.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      />
      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-amber-800">備註</Label>
            <Input
              placeholder="輸入備註"
              className="border-amber-200 focus:border-amber-400"
              {...field}
            />
            {errors.notes && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>
                  {String(errors.notes.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      />
    </>
  );
}
