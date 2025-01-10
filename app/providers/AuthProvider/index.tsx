import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
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
  handleLogin: () => { },
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const { trigger, isMutating } = useCheckUser();

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

  const handleLogout = useCallback(() => {
    document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    setIsLogin(false);
  }, [setIsLogin]);

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
          handleLogout();
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.log("檢查使用者狀態時發生錯誤:", error);
          handleLogout();
        }
      }
    };

    checkUserStatus();

    return () => {
      abortController.abort();
    };
  }, []);



  const contextValue = useMemo(
    () => ({
      isLogin,
      isLoading: isMutating,
      handleLogin,
    }),
    [isLogin, isMutating, handleLogin]
  );

  return (
    <AuthContext.Provider value={contextValue}>
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
