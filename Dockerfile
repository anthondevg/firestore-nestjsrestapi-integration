FROM node:20-alpine as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 8084

FROM node:20-alpine

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --omit=dev
COPY --from=build /usr/src/app/dist ./dist
CMD npm run start:prod