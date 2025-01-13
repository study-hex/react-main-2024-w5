# 建置階段
FROM node:20-alpine AS build
RUN npm i -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY . .
# 設定建置時的環境變數
ARG VITE_APP_API_URL
ARG VITE_APP_API_PATH
ENV VITE_APP_API_URL=${VITE_APP_API_URL}
ENV VITE_APP_API_PATH=${VITE_APP_API_PATH}
RUN pnpm build

# 運行階段
FROM nginx:alpine
# 複製檔案
COPY --from=build /app/build/client /usr/share/nginx/html/
# 複製 nginx 配置模板
COPY nginx.conf /etc/nginx/templates/default.conf.template
# 設定運行時的環境變數
ENV VITE_APP_API_URL=${VITE_APP_API_URL}
ENV VITE_APP_API_PATH=${VITE_APP_API_PATH}
EXPOSE 8080
# 使用 envsubst 來替換環境變數
CMD ["/bin/sh", "-c", "envsubst '${VITE_APP_API_URL} ${VITE_APP_API_PATH}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]