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

RUN groupadd app_user && \
    useradd -g app_user -s /usr/bin/bash app_user

USER app_user
WORKDIR /home/app_user

# TODO Move svelte app sources to a subdirectory.
COPY --chown=app_user:app_user . .

RUN npm install && \
    npm run build

WORKDIR /home/app_user/fastapi_backend
RUN python3.11 -m pip install -U pip && \
    python3.11 -m pip install -r requirements.txt

ENTRYPOINT ["python3.11", "-m", "uvicorn", "src.server:app", "--host", "0.0.0.0"]
