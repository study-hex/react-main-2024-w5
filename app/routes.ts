import { type RouteConfig, index, prefix } from "@react-router/dev/routes";

export default prefix("/react-main-2024-w3", [
    index("routes/home.tsx")
]) satisfies RouteConfig;