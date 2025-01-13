import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import { useDeleteProduct } from "@/service/product";

type ProductDeleteButtonPropsType = {
  productId: string;
};

export default function ProductDeleteButton(
  props: ProductDeleteButtonPropsType
) {
  const { productId } = props;

  const { toast } = useToast();

  const { trigger: triggerDelete, isMutating } = useDeleteProduct({
    id: productId,
  });

  const handleDelete = async () => {
    await triggerDelete();
    toast({
      title: "刪除成功",
      description: "產品已經被刪除",
      variant: "default",
    });

    await mutate((key?: [string, ...unknown[]]) => {
      if (key && Array.isArray(key)) {
        return key[0].includes("/admin/product");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 text-red-600"
      onClick={handleDelete}
      disabled={isMutating}
    >
      <Trash2Icon className="h-4 w-4" />
    </Button>
  );
}
