FROM ruby:3.1.2-alpine

RUN apk add --update --virtual \
  runtime-deps \
  postgresql-client \
  build-base \
  libxml2-dev \
  libxslt-dev \
  nodejs \
  yarn \
  libffi-dev \
  readline \
  build-base \
  postgresql-dev \
  sqlite-dev \
  libc-dev \
  linux-headers \
  readline-dev \
  file \
  imagemagick \
  git \
  tzdata \
  && rm -rf /var/cache/apk/*

WORKDIR /app
COPY . /app/

ENV BUNDLE_PATH /gems
ENV RAILS_ENV=development
RUN yarn install
RUN bundle install

RUN rm -f app/tmp/pids/server.pid
RUN rm -f tmp
EXPOSE 5000 5432
CMD ["bin/rails", "s", "-b", "0.0.0.0"]
