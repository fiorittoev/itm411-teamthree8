# Use Node 20
FROM node:20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build Expo web output
RUN npx expo export --platform web

# Install static file server
RUN npm install -g serve

# Expo export outputs to /dist
EXPOSE 19000

CMD ["serve", "-s", "dist", "-l", "19000"]