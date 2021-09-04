# stage 1

FROM node AS test-app
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# stage 2

FROM nginx
COPY --from=test-app /app/dist/test-app /usr/share/nginx/html
EXPOSE 80