FROM node:18 as base
RUN yarn config set registry https://registry.npmjs.org/ && \
    yarn global add @angular/cli@18
COPY package.json /app/package.json
WORKDIR /app
RUN yarn install --no-audit

FROM base AS build
COPY . /app 
WORKDIR /app
RUN ng build multidirectory-ui-kit && \
    npm link dist/multidirectory-ui-kit/

RUN ng build multidirectory-app --output-path=/dist

FROM nginx:1.17.1-alpine
COPY configurations/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build  /dist/. /usr/share/nginx/html/.

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/browser/assets/env.template.js > /usr/share/nginx/html/browser/assets/env.js && exec nginx -g 'daemon off;'"]
