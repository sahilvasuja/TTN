

# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port from .env (default fallback 5500)
EXPOSE 5500

# Run the app
CMD ["npm", "run", "dev"]

