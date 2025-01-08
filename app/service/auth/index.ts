import { createApiHooks } from "~/hooks/useApiFactory";

const authApiConfig = {
  useSignin: {
    path: '/admin/signin',
    method: 'POST',
  }
} as const;

export const { useSignin } = createApiHooks(authApiConfig);