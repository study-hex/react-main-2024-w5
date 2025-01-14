type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestConfig = {
    method?: string;
    params?: Record<string, string | number>;
    data?: Record<string, unknown>;
    formData?: FormData;
    headers?: Record<string, string>;
    [key: string]: unknown;
};

type APIResponse<T> = {
    data: T;
    status: number;
    message: string;
    [key: string]: unknown;
}

type EndpointConfig = {
    [key: string]: {
        path: string;
        method?: HttpMethod;
    };
};
