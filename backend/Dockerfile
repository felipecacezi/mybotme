FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run app:build

EXPOSE 4000

CMD ["node", "dist/server.js"]
