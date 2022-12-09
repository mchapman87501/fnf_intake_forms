FROM ubuntu:22.04 AS builder

RUN apt-get update && \
    apt-get install -y \
    python3.11 python3-pip python-is-python3 curl 

# https://github.com/nodesource/distributions#debinstall
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@9.2.0

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd service_runner && \
    useradd -g service_runner -d /home/service_runner --create-home -s /usr/bin/bash service_runner

# TODO Move svelte app sources to a subdirectory.
WORKDIR /home/service_runner
COPY --chown=service_runner:service_runner  . ./intake_forms/

RUN echo "Contents of /home/service_runner/intake_forms:"
RUN ls -ld /home/service_runner/intake_forms
RUN ls -al /home/service_runner/intake_forms

USER service_runner
WORKDIR /home/service_runner/intake_forms
RUN npm install

USER root
RUN chown -R service_runner:service_runner "/home/service_runner/.npm"

USER service_runner
RUN npm run build

WORKDIR /home/service_runner/intake_forms/fastapi_backend
RUN python3.11 -m pip install -U pip && \
    python3.11 -m pip install -r requirements.txt

ENTRYPOINT ["python3.11", "-m", "uvicorn", "src.server:app", "--host", "0.0.0.0"]
