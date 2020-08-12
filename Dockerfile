FROM arm32v7/node

RUN apt-get update \
    && apt-get install -y --no-install-recommends software-properties-common \
    && apt-add-repository 'deb http://archive.raspbian.org/raspbian stretch main contrib non-free rpi firmware' \
    && apt-add-repository 'deb http://archive.raspberrypi.org/debian stretch main'

# Create app directory
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "server.js" ]