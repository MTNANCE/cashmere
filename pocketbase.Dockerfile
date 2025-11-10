FROM alpine:latest

ARG PB_VERSION=0.23.3

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    curl

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Copy migrations and hooks from codebase into container
COPY pocketbase/pb_migrations /pb/pb_migrations
COPY pocketbase/pb_hooks /pb/pb_hooks

# Create startup script
COPY scripts/docker-entrypoint.sh /pb/
RUN chmod +x /pb/docker-entrypoint.sh

EXPOSE 8119

WORKDIR /pb

# Use entrypoint script
CMD ["/pb/docker-entrypoint.sh"]
