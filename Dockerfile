FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# copy all files from the current directory to the container like src files
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
#test12
