import { z } from "zod";

export const defaultValues = {
    title: "",
    category: "",
    imageUrl: "",
    description: "",
    content: "",
    origin_price: 0,
    price: 0,
    unit: "",
    imagesUrl: [],
    is_enabled: false,
};

export const productSchema = z.object({
    title: z.string().min(1, "必填"),
    category: z.string().min(1, "必填"),
    imageUrl: z.string(),
    description: z.string(),
    content: z.string(),
    origin_price: z.number(),
    price: z.number().min(0, "售價不能小於 0"),
    unit: z.string(),
    imagesUrl: z.array(z.string()),
    is_enabled: z
        // 表單中使用 boolean 型別
        .boolean()
        // 轉換成數字 1 或 0
        .transform((value) => (value ? 1 : 0))
        // 確保最終型別為 number
        .pipe(z.number())
});