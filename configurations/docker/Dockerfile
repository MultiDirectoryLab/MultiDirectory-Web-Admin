FROM node:22 as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g corepack@latest
RUN corepack enable
COPY package.json /app/package.json
WORKDIR /app
RUN pnpm install -g @angular/cli@19 &&\
    pnpm install
COPY . .
RUN ng build multidirectory-ui-kit &&\
    pnpm add file:dist/multidirectory-ui-kit/ &&\
    ng build multidirectory-app --output-path=/app/dist

FROM nginx:1.17.1-alpine
COPY configurations/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=base  /app/dist/. /usr/share/nginx/html/.

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/browser/assets/env.template.js > /usr/share/nginx/html/browser/assets/env.js && exec nginx -g 'daemon off;'"]
