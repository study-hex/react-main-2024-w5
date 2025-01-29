import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default prefix("/react-main-2024-w5", [
    index("routes/home.tsx"),
    route("desk", "routes/desk.tsx"),
]) satisfies RouteConfig;