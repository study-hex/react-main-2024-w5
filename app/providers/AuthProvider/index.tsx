import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useCheckUser } from "~/service/auth";

type LoginResponseType = {
  token: string;
  expired: number;
};

type AuthContextType = {
  isLogin: boolean;
  isLoading: boolean;
  handleLogin: (response: LoginResponseType) => void;
};

const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  isLoading: false,
  handleLogin: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const { trigger, isMutating } = useCheckUser();

  useEffect(() => {
    const abortController = new AbortController();

    const checkUserStatus = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];

      if (!token) {
        setIsLogin(false);
        return;
      }

      try {
        const response = await trigger();
        if (response.success) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.log("檢查使用者狀態時發生錯誤:", error);
          setIsLogin(false);
        }
      }
    };

    checkUserStatus();

    return () => {
      abortController.abort();
    };
  }, [trigger]);

  const handleLogin = useCallback(
    (response: LoginResponseType) => {
      setIsLogin(true);

      const { token, expired } = response;
      document.cookie = `hexToken=${token};expires=${new Date(
        expired
      ).toUTCString()};`;
    },
    [setIsLogin]
  );

  return (
    <AuthContext.Provider
      value={{ isLogin, isLoading: isMutating, handleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}
