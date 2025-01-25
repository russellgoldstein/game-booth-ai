# Build stage
FROM node AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g typescript
COPY . . 
RUN npm run build

# Production stage
FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production

#set time zone to New York
RUN ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

COPY --from=builder /usr/src/app/dist ./dist
CMD [ "node", "dist/index.js" ]
EXPOSE 3000
