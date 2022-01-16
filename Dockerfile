FROM node

WORKDIR /app

COPY . /app


CMD node /app/server.js
