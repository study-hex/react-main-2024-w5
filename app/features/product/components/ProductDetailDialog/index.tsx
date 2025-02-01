import { useState, startTransition } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { Plus, Minus } from "lucide-react";

import { type Product } from "~/features/product";

import { useToast } from "~/hooks/use-toast";

import { useOneProduct } from "~/service/product/public";
import { useCreateCart } from "~/service/cart";

type ProductDetailDialogPropsType = {
  productId: string;

  open: boolean;
  handleOpenChange: () => void;
};

export default function ProductDetailDialog(
  props: ProductDetailDialogPropsType
) {
  const { productId, open, handleOpenChange } = props;

  const { toast } = useToast();

  const [count, setCount] = useState<number>(1);

  const { data, isLoading } = useOneProduct({ id: productId });
  const { trigger: triggerCart, isMutating } = useCreateCart();

  const product = data?.product as Product;

  const handleAddToCart = async () => {
    const payload = {
      data: {
        product_id: productId,
        qty: count,
      },
    };
    try {
      await triggerCart({ data: payload });

      toast({
        title: "更新成功",
        variant: "default",
      });

      await mutate((key?: [string, ...unknown[]]) => {
        if (key && Array.isArray(key)) {
          return key[0].includes("/cart");
        }
      });

      startTransition(() => {
        handleOpenChange();
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
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {data && (
        <DialogContent className="max-w-3xl">
          <DialogTitle>商品詳情</DialogTitle>

          <div className="grid grid-cols-2 gap-8">
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col space-y-6 py-4">
              <div className="flex-1">
                <DialogDescription>
                  <h2 className="text-2xl font-medium">{product.title}</h2>
                </DialogDescription>

                <p className="mt-2 text-gray-500 leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-2xl font-medium">
                  NT$ {new Intl.NumberFormat().format(product.price)}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCount(count - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{count}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCount(count + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={isMutating}
                >
                  加入購物車
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
