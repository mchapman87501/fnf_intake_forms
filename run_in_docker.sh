#!/bin/sh
set -e -u


docker build -t fnf_intake:latest .

# Run as a single-service swarm so you can pass secrets?
cat <<EOF
1. To run under docker swarm:
$ docker swarm init

# Load your secrets into docker secret:
$ cd fastapi_backend
echo "admin" | docker secret create admin.username -
dotenv get admin.password | docker secret create admin.password -
...

# Create the service:
$ docker service create \
    --secret="admin.username" \
    --secret="admin.password" \
    --secret="jwt.access.token.secret" \
    --secret="jwt.access.token.duration" \
    -p 8000:8000 \
    fnf_intake:latest
EOF

cat <<EOF2
2. To run using `docker compose`
# Load your secrets into these files:
    .docker_compose_secrets/admin.username
    .docker_compose_secrets/admin.password
    .docker_compose_secrets/jwt.access.token.secret
    .docker_compose_secrets/jwt.access.token.duration

# Protect the secrets as best you can - perhaps by setting file permissions to
# 0400?

# Launch the service:
$ docker compose up
EOF2
