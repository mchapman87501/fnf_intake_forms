# Overview

Here are some notes about the SvelteKit / Vite backend for this web application.

## Setting Up a Runtime Environment

### Define Secrets

Confidential info, such as the secret key used to hash user credentials,
must be kept out of revision control. But such info is still needed at
runtime.

This prototype uses SvelteKit's `$env/static/private` facility to access secrets (as environment vars) loaded from `./.env`. It uses a `.gitignore` entry to ensure `.env` is not added to any source control repo.

`env_template.in` can be used as a template for `./.env`. It has entries for
all of the environment variables that are known to be needed as of time of writing.

### Elastic Beanstalk

What a mess that is...

To deploy to eb: `eb create` and answer a bunch of questions.
Supposedly if you have a `.env` file at the root of your repository, that can contain
environment variable definition ("secrets") to use during deployment.

As an alternative, if you have a saved, working beanstalk environment that has been
saved via `eb config get`, then you can create/deploy using `eb create --cfg saved-config-name`.

As another alternative, you can specify environment variables:
`eb create --envvars ENVVARS` where `ENVVARS` is "a comma-separated list of environment variables as key=value pairs".

## Session Management

The app maintains a JSON user database in `./data/internal/users.db`. It stores passwords encrypted using bcrypt.

For REST API endpoints that require an authenticated user, such as `/api/v1/owner_surrender_form`, the app uses a JWT access token (sent back and forth using the `Authorization` http header) and a session token (transmitted via a cookie).

This part of the app is very much a prototype. Client and server must both add a bunch of boilerplate to ensure tokens are transmitted, validated and updated when accessing endpoints that require authenticated users.

## Unit Tests

Hahaha. Tests will be added when the requirements are better understood.

## Saving Intake Forms

The app's REST endpoint `/api/v1/owner_surrender_form/` takes a JSON owner surrender form and saves it as a CSV file. The output directory, relative to the directory containing this README, is `./data/out/intake_forms`.
