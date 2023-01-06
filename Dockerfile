FROM node:slim

RUN groupadd service_runner && \
    useradd -g service_runner -d /home/service_runner --create-home -s /usr/bin/bash service_runner

USER service_runner
WORKDIR /home/service_runner
COPY --chown=service_runner:service_runner  . ./intake_forms/

WORKDIR /home/service_runner/intake_forms
RUN npm install

# NOTES: "npm run build" needs the project's secrets to be defined in
# .env.production.docker.  The required vars are listed in env_template.in, modulo bit rot.
#
# Environment variables will be needed at runtime, as well.
# docker run -d -p 80:3000 --env-file=.env.production.docker <tag>
#
# It may be easier to use
# docker compose up --build

COPY --chown=service_runner:service_runner .env.production.docker .env
RUN npm run build

# Why the 'ORIGIN' setting?
# https://stackoverflow.com/a/73821896
# https://github.com/sveltejs/kit/tree/master/packages/adapter-node#origin-protocol_header-and-host_header
ENV ORIGIN=http://localhost
ENTRYPOINT ["node", "build/index.js"]