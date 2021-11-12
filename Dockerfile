# build environment
FROM node:15.10-alpine
RUN apk add --update \
    git \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY . /app
RUN yarn
RUN NODE_OPTIONS="--max_old_space_size=4096" yarn run build
