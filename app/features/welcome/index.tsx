import Login from "~/features/login";

import { useAuth } from "~/providers/AuthProvider";

export default function Welcome() {
  const { isLogin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLogin ? (
        <div>
          <h1>Welcome to the app</h1>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}
