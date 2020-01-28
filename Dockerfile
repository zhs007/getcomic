FROM node:12

MAINTAINER zerro "zerrozhao@gmail.com"

RUN apt-get update -y

RUN apt-get install -y --no-install-recommends --no-install-suggests \
        gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
        libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
        libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
        libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
    && rm -rf /var/lib/apt/lists/*

RUN wget -O /usr/local/share/fonts/SourceHanSans-Normal.ttc https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTC/SourceHanSans-Normal.ttc

WORKDIR /usr/src/app/

COPY package.json ./
COPY package-lock.json ./
RUN npm i -dd

COPY ./ ./

CMD ["node", "./bin/getcomic.js", "start", "./cfg/config.yaml"]