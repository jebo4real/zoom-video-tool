FROM node:12.20.1-alpine3.12


RUN apk update \
 && apk --update --no-cache add git

# set working dir
WORKDIR /app

COPY package.json .
COPY package-lock.json .


#copy project
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
