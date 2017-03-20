FROM node

COPY . /code

WORKDIR /code

RUN node -v

RUN rm -rf node_modules

RUN npm install --unsafe-perm

ENTRYPOINT ["npm","start"]
