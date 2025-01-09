import { FormProvider, Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Eye, EyeOff, BookOpen } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useToggle } from "@/hooks/useToggle";

import { useAuth } from "@/providers/AuthProvider";
import { useSignin } from "@/service/auth";

import { loginSchema, defaultValues } from "./data/schema";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { handleLogin } = useAuth();

  const { toast } = useToast();
  const { open: isPasswordVisibility, toggle: togglePasswordVisibility } =
    useToggle(false);

  const { trigger } = useSignin();

  const returnMethods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    values: defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = returnMethods;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await trigger({ data });
      const { token, expired } = response;
      handleLogin({
        token: String(token),
        expired: Number(expired),
      });

      toast({
        title: "登入成功",
        description: "歡迎回來！",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "登入失敗",
        description:
          error instanceof Error ? error.message : "登入過程發生錯誤",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5" />
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center items-center space-x-2">
            <div className="p-2 bg-amber-800 rounded-lg">
              <BookOpen className="h-8 w-8 text-amber-50" />
            </div>
          </div>
          <CardTitle className="text-2xl font-serif text-center text-amber-900">
            會員登入
          </CardTitle>
          <CardDescription className="text-center text-amber-700">
            歡迎回來
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormProvider {...returnMethods}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Controller
                  name="username"
                  control={returnMethods.control}
                  render={({ field: { value, onChange, ref } }) => (
                    <>
                      <Label htmlFor="username" className="text-amber-800">
                        電子郵件
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                        <Input
                          id="username"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          aria-invalid={errors.username ? "true" : "false"}
                          value={value}
                          onChange={onChange}
                          ref={ref}
                        />
                      </div>
                      {errors.username && (
                        <Alert
                          variant="destructive"
                          className="text-red-800 bg-red-50 border-red-200"
                        >
                          <AlertDescription>
                            {errors.username.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Controller
                  name="password"
                  control={returnMethods.control}
                  render={({ field: { value, onChange, ref } }) => (
                    <>
                      <Label htmlFor="password" className="text-amber-800">
                        密碼
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                        <Input
                          id="password"
                          type={isPasswordVisibility ? "text" : "password"}
                          placeholder="輸入您的密碼"
                          className="pl-10 pr-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          aria-invalid={errors.password ? "true" : "false"}
                          value={value}
                          onChange={onChange}
                          ref={ref}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            togglePasswordVisibility();
                          }}
                          className="absolute right-3 top-3 text-amber-600 hover:text-amber-800 focus:outline-none"
                          aria-label={
                            isPasswordVisibility ? "隱藏密碼" : "顯示密碼"
                          }
                        >
                          {isPasswordVisibility ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <Alert
                          variant="destructive"
                          className="text-red-800 bg-red-50 border-red-200"
                        >
                          <AlertDescription>
                            {errors.password.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </FormProvider>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button
            className="w-full bg-amber-700 hover:bg-amber-800 text-amber-50"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "登入中..." : "登入"}
          </Button>
          <div className="text-sm text-center text-amber-700 hidden">
            還沒有帳號？
            <Button
              variant="link"
              className="pl-1 text-amber-800 hover:text-amber-900"
            >
              立即註冊
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
