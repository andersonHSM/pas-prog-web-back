FROM node:13

WORKDIR /usr/src/app/

COPY package*.json /usr/src/app/

RUN ["yarn"]

COPY . .