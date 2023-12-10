FROM node:20-alpine

WORKDIR /bot
COPY ./dist/apps/aquinas-bot .
COPY ./config ./config
# for local sqlite db
COPY ./db ./db

ENV PORT=4001
EXPOSE ${PORT}

RUN npm install

CMD node main.js