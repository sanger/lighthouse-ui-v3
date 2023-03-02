FROM node:18.14.2

WORKDIR /code
ADD . /code/

RUN npm ci

# build for production
RUN npm run build

# generate static project
RUN npm run generate

CMD ["env", "PORT=8000", "HOST=0.0.0.0", "npm", "start"]

HEALTHCHECK --interval=1m --timeout=5s \
    CMD curl -f http://localhost:8000/health || exit 1
