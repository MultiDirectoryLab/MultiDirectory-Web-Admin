FROM node:18.16.0 as build
RUN npm install -g @angular/cli@14.1.0
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN ng build multidirectory-ui-kit
RUN npm link dist/multidirectory-ui-kit/
RUN ng build multidirectory-app --output-path=/dist

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build  /dist/. /usr/share/nginx/html/.

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
