import { createApiHooks } from "~/hooks/useApiFactory";

const API_PATH = import.meta.env.VITE_APP_API_PATH;

const productApiConfig = {
    useProductsAll: {
        path: `/api/${API_PATH}/admin/products/all`,
        method: 'GET',
    }
} as const;

export const { useProductsAll } = createApiHooks(productApiConfig);