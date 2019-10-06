FROM node:latest

WORKDIR /src
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY src .


EXPOSE 8080

CMD ["npm", "start"]