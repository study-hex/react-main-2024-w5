import { startTransition } from "react";
import { FormProvider, Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { PencilIcon, PackageSearch, PlusCircle } from "lucide-react";

import LinearProgress from "@/components/LinearProgress";
import FormSection from "@/components/FormSection";

import { useToast } from "@/hooks/use-toast";
import { useToggle } from "@/hooks/useToggle";
import {
  useProductsAll,
  useUpdateProduct,
  useCreateProduct,
} from "@/service/product";
import { type ProductsType, type Product } from "@/features/product";

import { productSchema, defaultValues } from "./data/schema";
import ProductFormBasic from "./components/ProductFormBasic";
import ProductFormPrice from "./components/ProductFormPrice";
import ProductFormDescription from "./components/ProductFormDescription";
import ProductFormImage from "./components/ProductFormImage";

type ProductFormDialogPropsType = {
  productId?: string;
};

export default function ProductFormDialog(props: ProductFormDialogPropsType) {
  const { productId } = props;

  const { toast } = useToast();
  const { open, toggle, toggleClose } = useToggle(false);

  const { data, isLoading } = useProductsAll<ProductsType>();
  const { trigger: triggerUpdate } = useUpdateProduct({ id: productId });
  const { trigger: triggerCreate } = useCreateProduct();

  const isEditing = Boolean(productId);

  const selectedProduct =
    data?.products &&
    Object.values(data.products).find((product) => product.id === productId);

  const methods = useForm({
    resolver: zodResolver(productSchema),
    values: isEditing
      ? {
          ...defaultValues,
          ...selectedProduct,
          is_enabled: selectedProduct?.is_enabled === 1,
        }
      : defaultValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = methods;

  const handleDialogClose = () => {
    reset({
      ...defaultValues,
    });
    toggleClose();
  };

  const onSubmit = async (data: Product) => {
    try {
      const payload = {
        data: {
          ...data,
        },
      };
      const result = await (isEditing
        ? triggerUpdate({ data: payload })
        : triggerCreate({ data: payload }));

      toast({
        title: "更新成功",
        description: result.message,
        variant: "default",
      });

      await mutate((key?: [string, ...unknown[]]) => {
        if (key && Array.isArray(key)) {
          return key[0].includes("/admin/product");
        }
      });

      startTransition(() => {
        handleDialogClose();
      });
    } catch (error) {
      toast({
        title: "更新失敗",
        description:
          error instanceof Error ? error.message : "更新過程發生錯誤",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LinearProgress variant="indeterminate" />;
  }

  return (
    <Dialog
      open={open}
      // #NOTES: 會同時用來處理關閉視窗的按鈕
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          return handleDialogClose();
        }
        return toggle();
      }}
    >
      <DialogTrigger asChild>
        {isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-900 text-amber-700"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            新增
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm border-amber-200">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-800 rounded-lg">
              <PackageSearch className="h-5 w-5 text-amber-50" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-amber-900">
                編輯產品資訊
              </DialogTitle>
              <DialogDescription className="text-sm text-amber-700">
                填寫以下資訊以更新產品內容，標示 * 為必填欄位
              </DialogDescription>
            </div>
          </div>
          <Separator className="bg-amber-200" />
        </DialogHeader>

        <FormProvider {...methods}>
          <div className="max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
            <div className="space-y-8">
              <FormSection title="基本資訊" content={<ProductFormBasic />} />
              <FormSection title="價格設定" content={<ProductFormPrice />} />
              <FormSection
                title="商品描述"
                content={<ProductFormDescription />}
              />
              <FormSection title="圖片設定" content={<ProductFormImage />} />
            </div>
          </div>
        </FormProvider>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-amber-200">
          <div className="flex items-center space-x-2">
            <Controller
              name="is_enabled"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-4 h-4 border-amber-200 text-amber-600"
                    {...field}
                  />
                  <Label className="text-amber-800">啟用商品</Label>
                </div>
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDialogClose}
              className="border-amber-200 text-amber-800 hover:bg-amber-50"
            >
              取消
            </Button>
            <Button
              className="bg-amber-700 hover:bg-amber-800 text-amber-50"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "儲存中..." : "儲存變更"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
