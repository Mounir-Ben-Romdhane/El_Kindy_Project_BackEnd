FROM node:18-alpine
WORKDIR /app
COPY . /app
EXPOSE 5000
CMD  ["npm", "start"]