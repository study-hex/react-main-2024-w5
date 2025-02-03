import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { DollarSign } from "lucide-react";

export default function ProductFormPrice() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Controller
        name="origin_price"
        control={control}
        render={({ field: { onChange, ...field } }) => (
          <div className="space-y-2">
            <Label htmlFor="origin_price" className="text-amber-800">
              原始價格
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-amber-600" />
              <Input
                {...field}
                id="origin_price"
                type="number"
                placeholder="0.00"
                className="pl-10 border-amber-200 focus:border-amber-400"
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "e" || e.key === "E" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            {errors.origin_price && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>
                  {String(errors.origin_price.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      />
      <Controller
        name="price"
        control={control}
        render={({ field: { onChange, ...field } }) => (
          <div className="space-y-2">
            <Label htmlFor="price" className="text-amber-800">
              售價 <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-amber-600" />
              <Input
                {...field}
                id="price"
                type="number"
                placeholder="0.00"
                className="pl-10 border-amber-200 focus:border-amber-400"
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "e" || e.key === "E" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            {errors.price && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>
                  {String(errors.price.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      />
      <Controller
        name="unit"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="unit" className="text-amber-800">
              單位 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="unit"
              placeholder="件/個/組"
              className="border-amber-200 focus:border-amber-400"
              {...field}
            />
            {errors.unit && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>
                  {String(errors.unit.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      />
    </div>
  );
}
