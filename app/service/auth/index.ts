import { createApiHooks } from "~/hooks/useApiFactory";

const authApiConfig = {
  useSignin: {
    path: '/admin/signin',
    method: 'POST',
  },
  useCheckUser: {
    path: '/api/user/check',
    method: 'POST',
  }
} as const;

export const { useSignin, useCheckUser } = createApiHooks(authApiConfig);