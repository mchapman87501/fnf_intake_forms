#!/bin/sh
set -e -u


docker build -t fnf_intake:latest .

# Run as a single-service swarm so you can pass secrets?
cat <<EOF
If you haven't already done this:
$ docker swarm init

# Load your secrets into docker secret:
$ cd fastapi_backend
echo "admin" | docker secret create admin.username -
dotenv get admin.password | docker secret create admin.password -
...
EOF

docker service create \
    --secret="admin.username" \
    --secret="admin.password" \
    --secret="jwt.access.token.secret" \
    --secret="jwt.access.token.duration" \
    -p 8000:8000 \
    fnf_intake:latest

# docker run --rm -p 8000:8000 fnf_intake:latest


