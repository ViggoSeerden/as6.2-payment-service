FROM node:lts-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN yarn
COPY --chown=node:node . .
EXPOSE 8083
CMD [ "yarn", "dev" ]