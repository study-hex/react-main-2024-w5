import { z } from "zod";

export const defaultValues = {
    title: "",
    category: "",
    imageUrl: "",
    description: "",
    content: "",
    origin_price: '0',
    price: '0',
    unit: "",
    imagesUrl: [],
    is_enabled: false,
};

const stringToNumber = (value: string) => {
    // 移除所有非數字和小數點的字元
    const cleaned = value.replace(/[^\d.]/g, '');
    const number = parseFloat(cleaned);
    return isNaN(number) ? 0 : number;
};

const priceSchema = z.string().transform(stringToNumber).pipe(z.number().min(0, "不能小於 0"));

export const productSchema = z.object({
    title: z.string().min(1, "必填"),
    category: z.string().min(1, "必填"),
    imageUrl: z.string(),
    description: z.string(),
    content: z.string(),
    origin_price: priceSchema,
    price: priceSchema,
    unit: z.string().min(1, "必填"),
    imagesUrl: z.array(z.string()),
    is_enabled: z
        // 表單中使用 boolean 型別
        .boolean()
        // 轉換成數字 1 或 0
        .transform((value) => (value ? 1 : 0))
        // 確保最終型別為 number
        .pipe(z.number())
});