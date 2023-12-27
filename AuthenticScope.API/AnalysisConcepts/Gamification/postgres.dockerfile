FROM postgres:15.1-alpine

LABEL author="AI21 Hackhathon"
LABEL description=""
LABEL version="1.0"

COPY *.sql /docker-entrypoint-initdb.d/