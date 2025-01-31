import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { Plus, Minus } from "lucide-react";

import { type Product } from "~/features/product";

import { useOneProduct } from "~/service/product/public";

type ProductDetailDialogPropsType = {
  productId: string;

  open: boolean;
  handleOpenChange: () => void;
};

export default function ProductDetailDialog(
  props: ProductDetailDialogPropsType
) {
  const { productId, open, handleOpenChange } = props;

  const { data, isLoading } = useOneProduct({ id: productId });

  const product = data?.product as Product;

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
                  <Button variant="outline" size="icon">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">1</span>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button size="lg" className="w-full">
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
