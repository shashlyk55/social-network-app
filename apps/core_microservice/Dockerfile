
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY tsconfig*.json ./

COPY apps/core_microservice/package*.json ./apps/core_microservice/
COPY packages/ ./packages/

RUN npm install

COPY . .

RUN npx turbo run build --filter=core_microservice
# RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/apps/core_microservice/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/core_microservice/package*.json ./

# COPY package*.json ./
# RUN npm install --only=production

RUN npm install -g pm2

# COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pm2-runtime", "dist/src/main.js"]