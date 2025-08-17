# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ . .
# Copy React build from local folder into container
# Make sure you run npm run build in client before docker build backend
COPY client/build ./client/build



EXPOSE 5000


CMD ["node", "server.js"]

