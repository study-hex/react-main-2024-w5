import Login from "~/features/login";
import Product from "~/features/product";

import { useAuth } from "~/providers/AuthProvider";

export default function Welcome() {
  const { isLogin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{isLogin ? <Product /> : <Login />}</>;
}
