import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProductFormBasic() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="title" className="text-amber-800">
              產品名稱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="輸入產品名稱"
              className="border-amber-200 focus:border-amber-400"
              {...field}
            />
            {errors.title && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>
                  {String(errors.title.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      />
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="category" className="text-amber-800">
              產品分類 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category"
              placeholder="選擇產品分類"
              className="border-amber-200 focus:border-amber-400"
              {...field}
            />
            {errors.category && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>
                  {String(errors.category.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      />
    </div>
  );
}
