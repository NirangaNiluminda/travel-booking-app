FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# copy all files from the current directory to the container like src files
COPY . .
# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
#test123456
