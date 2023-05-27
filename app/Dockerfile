FROM node:20-alpine As build-stage

# Create app directory
WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm ci && npm run build

FROM node:20-alpine as production-stage

WORKDIR /root/app

# Copy necessary files
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/dist ./dist

EXPOSE 8080

CMD ["npm", "run", "start"]
