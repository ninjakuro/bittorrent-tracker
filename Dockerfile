FROM node:22-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app .
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "dist/server.js"]
