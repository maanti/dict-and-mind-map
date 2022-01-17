FROM node:lts-alpine
WORKDIR /app
COPY . /app
CMD node /app/server.js
