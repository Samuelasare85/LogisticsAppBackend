# Build stage
FROM node:16-alpine as build

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . ./

RUN yarn global add nodemon
RUN yarn global add prisma
RUN prisma generate

EXPOSE 3000

CMD ["DEBUG", "=", "*", "yarn", "run", "dev"]
