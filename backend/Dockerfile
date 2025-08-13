FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose the port (Render/Railway provide PORT env)
EXPOSE 8080

# Start the server
CMD ["npm", "start"]


