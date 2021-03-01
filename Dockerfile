ARG NODE_TAG="12.18.3-alpine"

# Stage 1 - Build
FROM node:${NODE_TAG} as yarnBuild
WORKDIR /usr/src/app
ENV NODE_ENV="development"
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn run build
ENTRYPOINT ["yarn"]
CMD ["start:prod"]

# Stage 2 - Dependencies
FROM node:${NODE_TAG} as prodDeps
WORKDIR /usr/src/deps
ENV NODE_ENV="production"
COPY package.json yarn.lock ./
RUN yarn

# Stage 3 - Release
FROM node:${NODE_TAG} as api
WORKDIR /usr/src/app
RUN mkdir /usr/src/app/db
RUN chmod a+rw /usr/src/app/db
ENV NODE_ENV="production"
USER node:node
COPY --chown=node:node --from=prodDeps /usr/src/deps/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=yarnBuild /usr/src/app/dist /usr/src/app/dist
COPY --chown=node:node public /usr/src/app/dist/public
COPY --chown=node:node views /usr/src/app/dist/views

CMD ["node", "dist/main"]
