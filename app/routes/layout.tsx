import { Outlet } from "react-router";

import { useToggle } from "@/hooks/useToggle";

import CartListSheet from "@/features/public/components/CartListSheet";
import CheckoutFormDialog from "@/features/public/components/CheckoutFormDialog";

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

  const handleCheckout = () => {
    setCartOpenClose();
    setCheckoutOpen();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="container flex h-16 mx-auto items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight">Store</h1>

          <CartListSheet
            cartOpen={cartOpen}
            handleCartToggle={setCartToggle}
            onCheckout={handleCheckout}
          />
        </div>
      </header>

      <main className="container mx-auto py-12">
        <Outlet />
      </main>

      <CheckoutFormDialog
        checkoutOpen={checkoutOpen}
        handleOpenChange={setCheckoutToggle}
      />
    </div>
  );
}
