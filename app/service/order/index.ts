import { API_PATH } from "~/constants";
import { createApiHooks } from "~/hooks/useApiFactory";

const orderApiConfig = {
    useOrderList: {
        path: `/api/${API_PATH}/orders`,
        method: 'GET',
    },
    useOrderOne: {
        path: `/api/${API_PATH}/order/:id`,
        method: 'GET',
    },
    useCreateOrder: {
        path: `/api/${API_PATH}/order`,
        method: 'POST',
    }
} as const;

export const { useOrderList, useOrderOne, useCreateOrder } = createApiHooks(orderApiConfig);