import { startTransition } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

import ConfirmDialog from "@/components/ConfirmDialog";

import { useToast } from "@/hooks/use-toast";
import { useToggle } from "@/hooks/useToggle";

import { useDeleteProduct } from "@/service/product";

type ProductDeleteButtonPropsType = {
  productId: string;
};

export default function ProductDeleteButton(
  props: ProductDeleteButtonPropsType
) {
  const { productId } = props;

  const { toast } = useToast();
  const {
    open: isLoading,
    toggleOpen: openLoading,
    toggleClose: closeLoading,
  } = useToggle(false);

  const { trigger: triggerDelete, isMutating } = useDeleteProduct({
    id: productId,
  });

  const handleDelete = async () => {
    openLoading();
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
    startTransition(() => {
      closeLoading();
    });
  };

  return (
    <ConfirmDialog
      onConfirm={handleDelete}
      renderButton={
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 text-red-600"
          disabled={isMutating || isLoading}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      }
    />
  );
}
