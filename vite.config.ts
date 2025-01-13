import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path"

export default ({ mode }: ConfigEnv) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    server: {
      open: true,
      proxy: {
        '/v2': {
          target: process.env.VITE_APP_API_URL,
          changeOrigin: true,
        },
      },
    },
    base: "/react-main-2024-w3/",
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    plugins: [reactRouter(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./app"),
      },
    },
  });
}

