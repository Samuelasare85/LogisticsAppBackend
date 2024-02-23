# Build stage
FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . ./

RUN yarn global add nodemon
RUN yarn global add prisma
RUN prisma db push
RUN prisma generate

EXPOSE 3000

CMD ["yarn", "run", "dev"]
