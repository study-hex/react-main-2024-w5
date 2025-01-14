const API_PREFIX = '/v2';

const createUrl = (path: string | [string, ...unknown[]], params?: Record<string, string | number>) => {
  const pathStr = Array.isArray(path) ? path[0] : path;
  const normalizedPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
  let fullPath = `${API_PREFIX}${normalizedPath}`;

  if (!params) return fullPath;

  const paramsMap = new Map(Object.entries(params));

  // 處理路徑參數
  paramsMap.forEach((value, key) => {
    const placeholder = `:${key}`;
    if (fullPath.includes(placeholder)) {
      fullPath = fullPath.replace(placeholder, String(value));
      paramsMap.delete(key);
    }
  });

  // 處理查詢參數
  const searchParams = new URLSearchParams();
  paramsMap.forEach((value, key) => {
    searchParams.append(key, String(value));
  });

  return searchParams.toString() ? `${fullPath}?${searchParams}` : fullPath;
};

export const fetcher = async <T>(
  path: string | [string, ...unknown[]],
  { method = 'GET', params, data, formData, headers = {}, ...config }: RequestConfig = {}
): Promise<APIResponse<T>> => {
  const finalUrl = createUrl(path, params);

  // 如果有 formData，不設置 Content-Type，讓瀏覽器自動設置
  const requestHeaders = formData
    ? {
      ...headers, ...(Array.isArray(path) && typeof path[1] === 'object' && path[1]
        ? (path[1] as { headers?: Record<string, string> }).headers || {}
        : {}),
    }
    : {
      'Content-Type': 'application/json',
      ...headers,
      ...(Array.isArray(path) && typeof path[1] === 'object' && path[1]
        ? (path[1] as { headers?: Record<string, string> }).headers || {}
        : {}),
    };

  const response = await fetch(finalUrl, {
    method,
    headers: requestHeaders,
    body: formData || (data ? JSON.stringify(data) : undefined),
    ...config,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result;
};