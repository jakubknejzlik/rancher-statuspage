FROM node:7-alpine

COPY . /code

WORKDIR /code

RUN rm -rf node_modules

RUN npm install --unsafe-perm

ENTRYPOINT ["npm","start"]
