const API_PREFIX = '/v2';

const createUrl = (path: string, params?: Record<string, string | number>) => {
  const normalizedPath = path[0].startsWith('/') ? path[0] : `/${path[0]}`;
  const fullPath = `${API_PREFIX}${normalizedPath}`;

  if (!params) {
    return fullPath
  };

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return `${fullPath}?${searchParams.toString()}`;
};

export const fetcher = async <T>(
  path: string,
  { method = 'GET', params, data, headers = {}, ...config }: RequestConfig = {}
): Promise<APIResponse<T>> => {
  const finalUrl = createUrl(path, params);

  const response = await fetch(finalUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(Array.isArray(path) ? path[1]?.headers : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    ...config,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result;
};