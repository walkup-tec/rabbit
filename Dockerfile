FROM node:18

WORKDIR /app

COPY package.json .
RUN npm install

COPY consumer.js .

CMD ["node", "consumer.js"]
