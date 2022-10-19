FROM node:14.18-alpine
USER node

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node . .
RUN yarn install --frozen-lockfile

CMD ["yarn" , "start"]
