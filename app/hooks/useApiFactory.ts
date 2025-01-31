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

type EndpointConfig = {
  [key: string]: {
    path: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  };
};

type HooksType<T extends EndpointConfig> = {
  [K in keyof T]: T[K] extends { method: 'GET' | undefined }
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

const replaceDynamicParams = (path: string, params?: GetParams) => {
  if (!params) return { finalPath: path, queryParams: {} };

  let finalPath = path;
  const unusedParams: GetParams = { ...params };

  Object.entries(params).forEach(([key, value]) => {
    const placeholder = `:${key}`;
    if (finalPath.includes(placeholder)) {
      finalPath = finalPath.replace(placeholder, String(value));
      delete unusedParams[key];
    }
  });

  return { finalPath, queryParams: unusedParams };
};

export const createApiHooks = <T extends EndpointConfig>(
  endpoints: T
): HooksType<T> => {
  const result = {} as { [K in keyof T]: ReturnType<typeof createHook> };

  const createHook = <TData extends Record<string, unknown> | undefined>(
    endpoint: keyof T
  ) => {
    const { path, method = 'GET' } = endpoints[endpoint as string];

    if (method === 'GET') {
      return (params?: GetParams, swrConfig?: SWRConfiguration) => {
        const { finalPath, queryParams } = replaceDynamicParams(path, params);

        return useSWR<APIResponse<TData>>(
          Object.keys(queryParams || {}).length > 0
            ? [finalPath, queryParams]
            : finalPath,
          async (url) => {
            return fetcher(url, {
              method,
              params: queryParams,
            });
          },
          swrConfig
        );
      };
    }

    return () => {
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
      >(path, async (url: string, { arg }: { arg?: MutationParams<TData> }) => {
        const { finalPath, queryParams } = replaceDynamicParams(url, arg?.id ? { id: arg.id } : undefined);

        return fetcher(finalPath, {
          method,
          params: {
            ...queryParams,
            ...arg?.params,
          },
          data: arg?.data,
          formData: arg?.formData,
        });
      });

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