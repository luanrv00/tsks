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
ENV PORT 5000
RUN yarn install
RUN bundle install

#COPY entrypoint.sh /usr/bin/
#RUN chmod +x /usr/bin/entrypoint.sh
#ENTRYPOINT ["entrypoint.sh"]

EXPOSE 5000 5432
CMD ["./bin/rails", "s", "-b", "0.0.0.0"]
