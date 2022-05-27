FROM node:lts-alpine
ENV NODE_ENV=production
EXPOSE 8080/tcp
RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app
RUN apk update \
    && apk add --no-cache tini \ 
    && npm install --global npm@latest \
    && npm --version \
    && node --version
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --only=production \
    && npm cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH
COPY --chown=node:node . .
USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node","/opt/node_app/lib/index.js"]