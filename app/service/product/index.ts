import { API_PATH } from "~/constants";
import { createApiHooks } from "~/hooks/useApiFactory";

const productApiConfig = {
    useProductsAll: {
        path: `/api/${API_PATH}/admin/products/all`,
        method: 'GET',
    },
    useDeleteProduct: {
        path: `/api/${API_PATH}/admin/product/:id`,
        method: 'DELETE',
    },
    useUpdateProduct: {
        path: `/api/${API_PATH}/admin/product/:id`,
        method: 'PUT',
    },
    useCreateProduct: {
        path: `/api/${API_PATH}/admin/product/`,
        method: 'POST',
    }
} as const;

export const { useProductsAll, useDeleteProduct, useUpdateProduct, useCreateProduct } = createApiHooks(productApiConfig);