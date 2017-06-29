FROM node:8.1.2

# Create app directory
RUN mkdir -p /src/app/
WORKDIR /src/app

# Install app dependencies
COPY package.json /src/app/
RUN npm install --production

COPY . /src/app

EXPOSE 3000

CMD [ "npm", "start" ]