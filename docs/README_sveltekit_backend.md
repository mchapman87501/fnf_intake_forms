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

If you are running on [replit](https://replit.com) you will need to add each of the variables listed in `env_template.in`, using the "Secrets" tool.

### Running on Replit

The `@sveltejs/adapter-node` specified in `svelte.config.js` protects against cross-origin attacks.

Unfortunately, when running on replit, this causes attempts to log in to this prototype to fail.

The [recommended solution](https://github.com/sveltejs/kit/tree/master/packages/adapter-node#origin-protocol_header-and-host_header) is to define an `ORIGIN` environment variable when running on replit -- again, using the "Secrets" tool.

Also unfortunately, this doesn't seem to work. [Or, more accurately, I don't know what value to use for `ORIGIN` when running on replit. I've tried setting ORIGIN to the URL shown in my replit Webview, without success. -- Mitch]

An insecure workaround is to edit `svelte.config.js` and to add a `csrf` setting to the `kit` configuration:

```js
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		// ADD THIS
		csrf: {
			checkOrigin: false
		}
	}
}
```

### Elastic Beanstalk

(What a mess EB is...)

The easiest way to deploy this code as an EB application may be via the Elastic Beanstalk [command-line app](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html), `eb`.

The following is surely incomplete and not reproducible. But I was able _(once)_ to get the app up and running under ElasticBeanstalk by following these steps:

```shell
$ cd <root directory of this repo>

$ eb init
# answer a bunch of questions

$ eb create
# answer a bunch of questions

# Pass all of my secret config values to ElasticBeanstalk
# (for the world to see?):
$ eb setenv $(cat .env)
```

The resulting ElasticBeanstalk configuration _may_ be reflected in `elastic_beanstalk_example_config.yml`.
Supposedly one can install this configuration, after performing an `eb create`, by incanting the following:

```shell
$ ev config --update "file://${PWD}/docs/elastic_beanstalk_example_config.yml"
```

## Session Management

The app maintains a JSON user database in `./data/internal/users.db`. It stores passwords encrypted using bcrypt.

For REST API endpoints that require an authenticated user, such as `/api/v1/owner_surrender_form`, the app uses a JWT access token (sent back and forth using the `Authorization` http header) and a session token (transmitted via a cookie).

This part of the app is very much a prototype. Client and server must both add a bunch of boilerplate to ensure tokens are transmitted, validated and updated when accessing endpoints that require authenticated users.

## Unit Tests

Hahaha. Tests will be added when the requirements are better understood.

## Saving Intake Forms

The app's REST endpoint `/api/v1/owner_surrender_form/` takes a JSON owner surrender form and saves it as a CSV file. The output directory, relative to the directory containing this README, is `./data/out/intake_forms`.
