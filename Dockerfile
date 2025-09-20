FROM node:21.2.0
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build inventario
CMD ["npm", "run", "start:prod:inventario"]
