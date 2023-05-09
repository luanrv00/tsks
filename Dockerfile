FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

COPY /app/package.json .
COPY /app/yarn.lock .
COPY /app/next.config.js ./
COPY /app/public ./public
COPY /app/.next/standalone ./
COPY /app/.next/static ./.next/static
EXPOSE 3000
CMD ["yarn", "start"]
