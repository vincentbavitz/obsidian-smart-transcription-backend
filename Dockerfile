FROM node:16-alpine
VOLUME ["/root"]

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install --force -g ts-node yarn
RUN yarn install
RUN yarn setup

# If you are building your code for production
# RUN npm install --only=production
# Bundle app source
COPY . .
EXPOSE 9001
CMD [ "yarn", "start" ]