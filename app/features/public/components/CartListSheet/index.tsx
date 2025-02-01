import { startTransition } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { ShoppingCart, ChevronRight, Trash2, X } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import {
  useCartList,
  useDeleteAllCart,
  useDeleteOneCart,
} from "@/service/cart";

type CartListType = {
  carts: {
    id: string;
    product: {
      id: string;
      title: string;
      imageUrl: string;
    };
    qty: number;
    final_total: number;
  }[];
  final_total: number;
};

type CartListSheetPropsType = {
  cartOpen: boolean;
  handleCartToggle: () => void;
  onCheckout: () => void;
};

function DeleteItemButton({ id }: { id: string }) {
  const { trigger: triggerDeleteItem } = useDeleteOneCart({ id: id });

  const { toast } = useToast();

  const handleDeleteItem = async () => {
    try {
      await triggerDeleteItem();
      toast({
        title: "刪除成功",
        description: "商品已經被刪除",
        variant: "default",
      });
      await mutate((key?: [string, ...unknown[]]) => {
        if (key && Array.isArray(key)) {
          return key[0].includes("/cart");
        }
      });
    } catch (error) {
      toast({
        title: "刪除失敗",
        description:
          error instanceof Error ? error.message : "刪除過程發生錯誤",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleDeleteItem}
    >
      <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
    </Button>
  );
}

export default function CartListSheet(props: CartListSheetPropsType) {
  const { cartOpen, handleCartToggle, onCheckout } = props;

  const { toast } = useToast();

  const { data, isLoading } = useCartList();
  const { trigger: triggerDeleteAllCart } = useDeleteAllCart();

  const cartList = data?.data as CartListType;

  const handleClearCart = async () => {
    try {
      await triggerDeleteAllCart();
      toast({
        title: "清空購物車",
        description: "購物車已清空",
        variant: "default",
      });
      await mutate((key?: [string, ...unknown[]]) => {
        if (key && Array.isArray(key)) {
          return key[0].includes("/cart");
        }
      });

      startTransition(() => {
        handleCartToggle();
      });
    } catch (error) {
      toast({
        title: "清空購物車失敗",
        description:
          error instanceof Error ? error.message : "清空購物車過程發生錯誤",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {cartList && (
        <Sheet open={cartOpen} onOpenChange={handleCartToggle}>
          <SheetDescription />
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-xs text-white flex items-center justify-center">
                {cartList.carts?.length}
              </span>
            </Button>
          </SheetTrigger>

          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader className="flex flex-row items-center justify-between">
              <SheetTitle>購物車</SheetTitle>
              {cartList.carts.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearCart}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  清空購物車
                </Button>
              )}
            </SheetHeader>

            <div className="mt-8 space-y-8">
              {cartList.carts.map((item) => (
                <div key={item.id} className="flex gap-4 group relative">
                  <div className="h-24 w-24 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium">{item.product.title}</h3>
                    <p className="text-sm text-gray-500">
                      NT${new Intl.NumberFormat().format(item.final_total)}
                    </p>
                    <p>數量：{item.qty}</p>
                  </div>

                  <DeleteItemButton id={item.id} />
                </div>
              ))}

              <Separator />
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>總計</span>
                  <span className="font-medium">
                    NT${new Intl.NumberFormat().format(cartList.final_total)}
                  </span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={onCheckout}
                  disabled={cartList.carts.length === 0}
                >
                  結帳
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
