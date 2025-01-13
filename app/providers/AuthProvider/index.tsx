import {
  createContext,
  useContext,
  useState,
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
  handleLogin: () => {},
});

const getCookieToken = () => {
  // 檢查是否在瀏覽器環境
  if (typeof window === "undefined") {
    return undefined;
  }

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexToken="))
    ?.split("=")[1];
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { trigger, isMutating } = useCheckUser();

  const initialLoginState = async (): Promise<boolean> => {
    const token = getCookieToken();
    if (!token) {
      return false;
    }

    try {
      const response = await trigger();
      return Boolean(response.success);
    } catch (error) {
      console.log("檢查使用者狀態時發生錯誤:", error);
      return false;
    }
  };

  const [isLogin, setIsLogin] = useState(() => {
    initialLoginState().then((result: boolean) => setIsLogin(result));
    // 預設值
    return false;
  });

  const handleLogin = useCallback((response: LoginResponseType) => {
    setIsLogin(true);

    const { token, expired } = response;
    document.cookie = `hexToken=${token};expires=${new Date(
      expired
    ).toUTCString()};`;
  }, []);

  const handleLogout = useCallback(() => {
    document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsLogin(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      isLogin,
      isLoading: isMutating,
      handleLogin,
      handleLogout,
    }),
    [isLogin, isMutating, handleLogin, handleLogout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}
