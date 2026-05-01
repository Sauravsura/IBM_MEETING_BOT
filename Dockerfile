# Use Node.js version 18 or higher
FROM node:18

# Install SoX (Required for the mic library to work inside the container)
RUN apt-get update && apt-get install -y sox libsox-fmt-all

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Start the listener by default
CMD [ "node", "listen.js" ]