FROM node:16.18.1

COPY taxonomy-service-gui/ /app
RUN cd /app && npm install

ENTRYPOINT npm run
CMD serve
