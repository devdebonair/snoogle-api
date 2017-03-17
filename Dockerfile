FROM node:7.7.3

# Add our user and group first to make sure their IDs get assigned consistently
RUN groupadd -r node && useradd -m -r -g node node
USER node

dockerd --userns-remap=default

# Create app directory
RUN mkdir -p /src/app/
WORKDIR /src/app

# Install app dependencies
COPY package.json /src/app/
RUN npm install --production

COPY . /src/app

EXPOSE 3000

CMD [ "npm", "start" ]