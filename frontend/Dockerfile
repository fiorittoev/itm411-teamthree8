# Use Node 20
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project (including .env)
COPY . .

# Expose ports for Expo
EXPOSE 19000 19001 19002 8081

# Start Expo with tunnel (works for mobile & web)
CMD ["npx", "expo", "start", "--tunnel"]
