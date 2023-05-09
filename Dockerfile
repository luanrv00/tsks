FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

COPY package.json /app/
COPY yarn.lock /app/
COPY next.config.js /app/
COPY public /app/public
COPY .next /app/.next
EXPOSE 3000
CMD ["yarn", "start"]
