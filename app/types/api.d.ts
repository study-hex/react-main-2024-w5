type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestConfig = RequestInit & {
    params?: Record<string, string | number>;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
}

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
