import { z } from "zod";

export const defaultValues = {
    user: {
        name: "",
        email: "",
        tel: "",
        address: "",
    },
    message: "",
};

export const checkoutSchema = z.object({
    user: z.object({
        name: z.string().min(1, { message: "請輸入姓名" }),
        email: z
            .string()
            .min(1, { message: "請輸入電子郵件" })
            .email({ message: "請輸入有效的電子郵件格式" }),
        tel: z
            .string()
            .min(1, { message: "請輸入電話" })
            .regex(/^\d{10}$/, { message: "請輸入有效的電話格式" }),
        address: z.string().min(1, { message: "請輸入地址" }),
    }),
    message: z.string().max(200, { message: "最多 200 個字元" }),
})