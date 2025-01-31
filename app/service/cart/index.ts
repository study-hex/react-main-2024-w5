import { API_PATH } from "~/constants";
import { createApiHooks } from "~/hooks/useApiFactory";

const cartApiConfig = {
    useCartList: {
        path: `/api/${API_PATH}/cart`,
        method: 'GET',
    },
    useDeleteAllCart: {
        path: `/api/${API_PATH}/carts`,
        method: 'DELETE',
    },
    useDeleteOneCart: {
        path: `/api/${API_PATH}/cart/:id`,
        method: 'DELETE',
    },
    useUpdateCart: {
        path: `/api/${API_PATH}/cart/:id`,
        method: 'PUT',
    },
    useCreateCart: {
        path: `/api/${API_PATH}/cart`,
        method: 'POST',
    }
} as const;

export const { useCartList, useDeleteOneCart, useDeleteAllCart, useUpdateCart, useCreateCart } = createApiHooks(cartApiConfig);