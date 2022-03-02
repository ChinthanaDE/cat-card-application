FROM node:16.13.2

LABEL version="1.0"
LABEL description="This is the base docker image for the cat-card-application using Node.js"
LABEL maintainer = ["chinthanadesilva2@gmail.com"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install
COPY . ./

CMD ["npm", "start"]