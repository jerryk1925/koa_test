FROM node:12
WORKDIR /usr/app

COPY package.json .
COPY nodemon.json .
COPY tsconfig.json .
COPY ormconfig.json .
COPY tslint.json .
RUN yarn

COPY . .
EXPOSE 8000

CMD [ "yarn"," start" ]
