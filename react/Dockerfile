# Step 1: Build the React app
FROM node:20 AS build   # use Node 20 instead of 18
WORKDIR /app
COPY package*.json ./
RUN npm ci              # use s ci for clean, reproducible install
COPY . .
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
