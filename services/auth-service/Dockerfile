FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# IMPORTANT: Change the port for each service
EXPOSE 4001

CMD ["npm", "start"]