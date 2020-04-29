FROM node:10-stretch-slim
RUN mkdir -p /usr/src/app
RUN apt-get update && apt-get install --yes python && apt-get install python-pip -y;
RUN pip install --upgrade pip && pip install pandas;
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm install
EXPOSE 8888
CMD [ "node", "server.js" ]
