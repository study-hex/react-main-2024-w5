import { Outlet } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { ShoppingCart, ChevronRight } from "lucide-react";

import { useToggle } from "@/hooks/useToggle";

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

export default function Layout() {
  const {
    open: cartOpen,
    toggle: setCartToggle,
    toggleClose: setCartOpenClose,
  } = useToggle(false);
  const {
    open: checkoutOpen,
    toggle: setCheckoutToggle,
    toggleOpen: setCheckoutOpen,
  } = useToggle(false);

  const { data, isLoading } = useCartList();

  const cartList = data?.data as CartListType;

  const handleCheckout = () => {
    setCartOpenClose();
    setCheckoutOpen();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="container flex h-16 mx-auto items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight">Store</h1>

          {cartList && (
            <Sheet open={cartOpen} onOpenChange={setCartToggle}>
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
                      onClick={handleCheckout}
                    >
                      結帳
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>

      <main className="container mx-auto py-12">
        <Outlet />
      </main>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutToggle}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>結帳資訊</DialogTitle>
          </DialogHeader>
          <form className="mt-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="請輸入 Email"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                收件人姓名
              </label>
              <Input id="name" placeholder="請輸入姓名" className="h-12" />
            </div>

            <div className="space-y-2">
              <label htmlFor="tel" className="text-sm font-medium">
                收件人電話
              </label>
              <Input id="tel" placeholder="請輸入電話" className="h-12" />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                收件人地址
              </label>
              <Input id="address" placeholder="請輸入地址" className="h-12" />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                訂單備註
              </label>
              <Textarea
                id="message"
                placeholder="有什麼想告訴我們的..."
                className="min-h-[120px]"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full h-12 text-base">
                完成訂購
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
