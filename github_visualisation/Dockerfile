FROM node:latest

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./


RUN npm install
RUN npm i react-charts --save --force
RUN npm install victory
RUN npm install react-bootstrap bootstrap@5.1.3
RUN npm install react-resizable

COPY . ./

CMD ["npm", "start"]
