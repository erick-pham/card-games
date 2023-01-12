FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
