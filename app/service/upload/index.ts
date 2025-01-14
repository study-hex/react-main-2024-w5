import { API_PATH } from "~/constants";
import { createApiHooks } from "~/hooks/useApiFactory";

const uploadApiConfig = {
    useUpload: {
        path: `/api/${API_PATH}/admin/upload`,
        method: 'POST',
    },
} as const;

export const { useUpload } = createApiHooks(uploadApiConfig);