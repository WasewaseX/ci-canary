# The canary image: smallest honest Docker fixture for the ten-stack CI run.
FROM alpine:3.20

RUN apk add --no-cache curl

COPY php-src/Greeter.php /app/Greeter.php

CMD ["true"]
