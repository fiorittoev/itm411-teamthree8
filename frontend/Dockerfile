FROM node:20 AS base
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ---------- Mobile (Expo Go / device) ----------
FROM base AS mobile
EXPOSE 19000 19001 19002
CMD ["npx", "expo", "start", "--tunnel"]

# ---------- Web ----------
FROM base AS web
EXPOSE 8081
CMD ["npx", "expo", "start", "--web", "--localhost"]
