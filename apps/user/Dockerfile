# Use the official Node.js image as base
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the whole project to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "start"]
