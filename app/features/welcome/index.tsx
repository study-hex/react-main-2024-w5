import Login from "~/features/login";
import Product from "~/features/product";

import LinearProgress from "~/components/LinearProgress";

import { useAuth } from "~/providers/AuthProvider";

export default function Welcome() {
  const { isLogin, isLoading } = useAuth();

  if (isLoading) {
    return <LinearProgress variant="indeterminate" />;
  }

  return <>{isLogin ? <Product /> : <Login />}</>;
}
