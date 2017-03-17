FROM node:7.7.3

# Add our user and group first to make sure their IDs get assigned consistently
RUN addgroup -S node && adduser -S -g node node

# Create app directory
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]