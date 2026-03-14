FROM node:24-alpine AS development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD ["node", "ace", "serve", "--hmr"]
