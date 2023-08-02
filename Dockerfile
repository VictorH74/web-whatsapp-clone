FROM node:20-alpine

WORKDIR /node/home/app
COPY . .

EXPOSE 3000