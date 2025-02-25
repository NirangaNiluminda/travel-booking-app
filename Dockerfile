FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# copy all files from the current directory to the container like src files
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Push database schema
RUN npx prisma db push --schema=./src/prisma/schema.prisma

# Build the application - ADD THIS LINE
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
