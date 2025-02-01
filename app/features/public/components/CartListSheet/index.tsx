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

import { ShoppingCart, ChevronRight } from "lucide-react";

import { useCartList } from "@/service/cart";

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

export default function CartListSheet(props: CartListSheetPropsType) {
  const { cartOpen, handleCartToggle, onCheckout } = props;

  const { data, isLoading } = useCartList();

  const cartList = data?.data as CartListType;

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
            <SheetHeader>
              <SheetTitle>購物車</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-8">
              {cartList.carts.map((item) => (
                <div key={item.id} className="flex gap-4">
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
                      NT$
                      {new Intl.NumberFormat().format(item.final_total)}
                    </p>
                    <p>
                      數量：
                      {item.qty}
                    </p>
                    {/* <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">1</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div> */}
                  </div>
                </div>
              ))}
              <Separator />
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>總計</span>
                  <span className="font-medium">
                    NT$
                    {new Intl.NumberFormat().format(cartList.final_total)}
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
