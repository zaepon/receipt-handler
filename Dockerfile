FROM node:20-alpine AS base

RUN apk add --no-cache graphicsmagick ghostscript
    
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]