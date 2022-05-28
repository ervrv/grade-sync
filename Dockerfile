FROM ubuntu

USER root
RUN apt-get update && apt-get install -y curl gnupg
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        python


RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -

RUN apt-get -y install nodejs

RUN mkdir -p /usr/bin/app
WORKDIR /usr/bin/app

COPY package*.json /usr/bin/app/
RUN npm i --no-save

COPY . /usr/bin/app/
COPY ./conf /usr/bin/app/conf/

EXPOSE 3005

CMD ["npm", "start"]


