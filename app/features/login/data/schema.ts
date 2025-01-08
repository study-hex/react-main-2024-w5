import { z } from "zod";

export const defaultValues = {
  username: "",
  password: "",
};

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "請輸入電子郵件" })
    .email({ message: "請輸入有效的電子郵件格式" }),
  password: z
    .string()
    .min(6, { message: "密碼至少需要 6 個字元" })
    .max(50, { message: "密碼最多 50 個字元" }),
});