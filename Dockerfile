# Stage 1: Build the TypeScript code
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you're using Yarn)
COPY package*.json ./

# Install dependencies
RUN npm install --force

COPY . .

# Generate Prisma client and keys
RUN npx prisma generate


# Build the TypeScript code
RUN npm run build

# Stage 2: Create a production image
FROM node:20 AS production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you're using Yarn)
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy the built code from the build stage
COPY --from=build /app/dist ./dist

# Copy Prisma schema and migrations if needed
COPY --from=build /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads

RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]