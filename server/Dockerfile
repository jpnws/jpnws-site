# Stage 1: Base Image for Builder
FROM node:18.8-alpine as base

# Stage 2: Builder
FROM base as builder

# Install build tools required for `sharp` compilation
RUN apk add --no-cache build-base gcc g++ make python3

# Set up the working directory and copy necessary files
WORKDIR /home/node/app
COPY package*.json ./

# Install all dependencies including `sharp` for linuxmusl
RUN npm install --platform=linuxmusl --arch=x64

# Copy the source files and run the build process
COPY . .
RUN npm run build

# Stage 3: Runtime Environment
FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

# Set up the working directory and copy production dependencies
WORKDIR /home/node/app
COPY package*.json ./
COPY package-lock.json ./

RUN npm install --production

ADD https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem /home/node/app/global-bundle.pem

# Copy the built assets from the builder stage
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

# Expose the application port
EXPOSE 3001

# Start the server
CMD ["node", "dist/server.js"]
