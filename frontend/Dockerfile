FROM node:20 AS base
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ---------- Mobile (Expo Go / device) ----------
FROM base AS mobile
EXPOSE 19001 19002
CMD ["npx", "expo", "start", "--lan"]

# ---------- Web ----------
FROM base AS web
EXPOSE 8081
CMD ["npx", "expo", "start", "--web", "--localhost"]
