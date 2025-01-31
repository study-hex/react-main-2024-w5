import { API_PATH } from "~/constants";
import { createApiHooks } from "~/hooks/useApiFactory";

const publicProductApiConfig = {
    useProductsAll: {
        path: `/api/${API_PATH}/products/all`,
        method: 'GET',
    },
    useProducts: {
        path: `/api/${API_PATH}/products`,
        method: 'GET',
    },
    useOneProduct: {
        path: `/api/${API_PATH}/product/:id`,
        method: 'GET',
    },
} as const;

export const { useProductsAll, useProducts, useOneProduct } = createApiHooks(publicProductApiConfig);