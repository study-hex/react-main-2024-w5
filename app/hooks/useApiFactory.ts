import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';

import { fetcher } from '~/utils/fetcher';

type GetParams = Record<string, string | number>;

type MutationParams<T> = {
  id?: string | number;
  params?: GetParams;
  data?: T;
  formData?: FormData;
};

type HooksType<T extends EndpointConfig> = {
  [K in keyof T]: T[K] extends { method: 'GET' }
  ? <TData extends Record<string, unknown> | undefined>(
    params?: GetParams,
    swrConfig?: SWRConfiguration
  ) => SWRResponse<APIResponse<TData>>
  : <TData extends Record<string, unknown> | undefined>(
    config?: MutationParams<TData>
  ) => MutationResult<TData>;
};

type MutationResult<TData> = {
  trigger: (
    arg?: MutationParams<TData>
  ) => Promise<APIResponse<TData>>;
  mutateAsync: (
    config?: MutationParams<TData>
  ) => Promise<APIResponse<TData>>;
  data: APIResponse<TData> | undefined;
  error: Error | undefined;
  reset: () => void;
  isMutating: boolean;
};

export const createApiHooks = <T extends EndpointConfig>(endpoints: T): HooksType<T> => {
  const result = {} as { [K in keyof T]: ReturnType<typeof createHook> };

  const createHook = <TData extends Record<string, unknown> | undefined>(
    endpoint: keyof T
  ) => {
    const { path, method = 'GET' } = endpoints[endpoint as string];

    if (method === 'GET') {
      return (params?: GetParams, swrConfig?: SWRConfiguration) => {
        return useSWR<APIResponse<TData>>(
          params ? [path, params] : path,
          async (url) => {
            return fetcher(url, {
              method,
              params: params,
            });
          },
          swrConfig
        );
      };
    }

    return (
      config?: MutationParams<TData>
    ) => {
      const {
        trigger,
        data,
        error,
        reset,
        isMutating,
      } = useSWRMutation<
        APIResponse<TData>,
        Error,
        string,
        MutationParams<TData>
      >(
        path,
        async (url: string, { arg }: { arg?: MutationParams<TData> }) =>
          fetcher(url, {
            method,
            params: {
              ...(config?.id ? { id: config.id } : {}),
              ...arg?.params
            },
            data: arg?.data,
            formData: arg?.formData,
          }),
      );

      return {
        trigger: (arg?: MutationParams<TData>) =>
          trigger(arg ?? { params: {}, data: undefined, formData: undefined }),
        mutateAsync: (mutationConfig?: MutationParams<TData>) => {
          const defaultConfig: MutationParams<TData> = {
            params: {},
            data: undefined,
            formData: undefined,
          };
          return trigger(mutationConfig ?? defaultConfig);
        },
        data,
        error,
        reset,
        isMutating,
      };
    };
  };

  for (const key in endpoints) {
    if (Object.prototype.hasOwnProperty.call(endpoints, key)) {
      result[key as keyof T] = createHook(key as keyof T);
    }
  }

  return result as HooksType<T>;
};