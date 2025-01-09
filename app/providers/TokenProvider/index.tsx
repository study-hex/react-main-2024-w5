import { SWRConfig, type Middleware, type SWRHook } from "swr";

const tokenMiddleware: Middleware = (useSWRNext: SWRHook) => {
  return (key, fetcher, config) => {
    const token =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("hexToken="))
            ?.split("=")[1]
        : undefined;

    const withToken = key
      ? [
          key,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        ]
      : null;

    const swr = useSWRNext(withToken, fetcher, config);
    return swr;
  };
};

export default function TokenProvider(props: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ use: [tokenMiddleware] }}>{props.children}</SWRConfig>
  );
}
