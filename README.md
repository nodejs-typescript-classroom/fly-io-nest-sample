# fly-io-nest-sample

This repository is for demo how to deploy nest app to fly.io

## Write Dockerfile 

because free trial has container limitation , we need to use customize multi-stage buildd

```yaml
FROM node:20.10.0-alpine as build
RUN mkdir /app
WORKDIR /app
RUN npm i -g pnpm
COPY src nest-cli.json package.json pnpm-lock.yaml tsconfig.build.json tsconfig.json /app/
RUN pnpm install --frozen-lockfile && pnpm run build
FROM node:20.10.0-alpine as prod
RUN mkdir /app
WORKDIR /app
RUN npm i -g pnpm
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/
RUN pnpm install --production && npm uninstall -g pnpm
USER node
ENTRYPOINT [ "node", "./dist/main" ]
```