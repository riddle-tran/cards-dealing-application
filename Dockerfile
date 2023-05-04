# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS base

# Hot reloading mod
FROM base AS dev
# Set the working directory to /app
WORKDIR /app
# Copy package.json and yarn.lock to /app
COPY package.json ./
COPY yarn.lock ./
# Install dependencies
RUN yarn install
# Copy the rest of the application code to /app
COPY . .
# Expose port 3000 for the application
EXPOSE 3000
EXPOSE 9229
# Start the application with nodemon
CMD ["yarn", "run", "dev"]


FROM base AS builder
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install
# Copy app files
COPY . .
# Build the app
RUN yarn build


FROM base as prod
WORKDIR /server
# Copy built assets from builder
COPY --from=builder /app /server

# Expose port
EXPOSE 3000
# Start server
CMD ["yarn", "run", "start"]