FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy all files from the current directory to the container
COPY . .

# Copy .env file for database connection
COPY .env .env

# Generate Prisma client
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Build the application
RUN npm run build

EXPOSE 3000

# Move DB push to runtime via start script
# This ensures MongoDB is available when the schema is pushed
CMD ["sh", "-c", "npx prisma db push --schema=./src/prisma/schema.prisma && npm run start"]