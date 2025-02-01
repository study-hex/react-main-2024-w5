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

type DefaultResponseData = Record<string, unknown>;

type HooksType<T extends EndpointConfig> = {
  [K in keyof T]: T[K] extends { method: 'GET' | undefined }
  ? <TData extends DefaultResponseData = DefaultResponseData>(
    params?: GetParams,
    swrConfig?: SWRConfiguration
  ) => SWRResponse<APIResponse<TData>>
  : T[K] extends { method: 'DELETE' }
  ? <TData extends DefaultResponseData = DefaultResponseData>(
    config?: Omit<MutationParams<TData>, 'data' | 'formData'>
  ) => MutationResult<TData>
  : <TData extends DefaultResponseData = DefaultResponseData>(
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

type RequestConfig<T extends DefaultResponseData> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: GetParams;
  data?: T;
  formData?: FormData;
  headers?: Record<string, string>;
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

  const createHook = <TData extends DefaultResponseData>(endpoint: keyof T) => {
    const { path, method = 'GET' } = endpoints[endpoint as string];

    if (method === 'GET') {
      return (params?: GetParams, swrConfig?: SWRConfiguration) => {
        const { finalPath, queryParams } = replaceDynamicParams(path, params);

        return useSWR<APIResponse<TData>>(
          Object.keys(queryParams || {}).length > 0
            ? [finalPath, queryParams]
            : finalPath,
          async (url) => {
            return fetcher<TData>(url, {
              method,
              params: queryParams,
            });
          },
          swrConfig
        );
      };
    }

    return (initialConfig?: MutationParams<TData>) => {
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
        const mergedConfig = {
          ...initialConfig,
          ...arg,
        };

        const { finalPath, queryParams } = replaceDynamicParams(
          url,
          mergedConfig?.id ? { id: mergedConfig.id } : undefined
        );

        const config: RequestConfig<TData> = {
          method,
          params: {
            ...queryParams,
            ...mergedConfig?.params,
          },
        };

        if (method !== 'DELETE') {
          if (mergedConfig?.data !== undefined && mergedConfig?.data !== null) {
            config.data = mergedConfig.data;
          }
          if (mergedConfig?.formData !== undefined) {
            config.formData = mergedConfig.formData;
          }
        }

        return fetcher<TData>(finalPath, config);
      });

      return {
        trigger: (arg?: MutationParams<TData>) =>
          trigger({
            ...initialConfig,
            ...arg,
          }),
        mutateAsync: (mutationConfig?: MutationParams<TData>) => {
          const mergedConfig = {
            ...initialConfig,
            ...mutationConfig,
          };
          return trigger(mergedConfig);
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
