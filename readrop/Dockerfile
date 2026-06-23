FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
COPY index.html ./
COPY public ./public
COPY src ./src

RUN npm install
RUN npm run build

FROM nginx:stable-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html/public
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
