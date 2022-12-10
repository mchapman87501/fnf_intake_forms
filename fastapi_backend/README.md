# Overview

This is a prototype Python FastAPI backend for the intake form web service.

Why it's of interest: makes it easier to implement a REST API that can be used,
not only by the Svelte front-end, but by native mobile apps (Flutter, iOS, etc.)
that might be easier to use offline.

Things to investigate:
* Authentication/authorization in FastAPI
* Methods for producing Excel content
* (Possibly) methods for sending generated intake forms to other web services
  -- or to email addresses at F&F -- or to shared folders in Google Docs.


## Setting Up a Runtime Environment

### Minimum Python Version

This code was developed with Python 3.11.0.  It has not been tested with
earlier versions of Python.  For that matter it has not been tested very much at all.


### Create a Python Virtual Environment
If you have `direnv` installed, it can use the `.envrc` file in this directory.

You could also use Python's [venv](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/#creating-a-virtual-environment).


### Install Packages

```python
python -m pip install -U pip
python -m pip install -r requirements.txt
```

### Define Secrets

Confidential info, such as the secret key used to hash user credentials,
must be kept out of revision control.  But such info is still needed at
runtime.

This prototype manages secrets in a way that's pretty standard as of time
of writing.  It uses [dotenv](https://pypi.org/project/python-dotenv/) to load
secrets from `./.env`, and it uses a `.gitignore` entry to ensure `.env` is
not added to any source control repo.

`env_template.in` can be used as a template for `./.env`.  It has entries for
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

### Start Coding

:grin:

See the [FastAPI Example](https://fastapi.tiangolo.com/#example).


## Keeping It Simple

So far the most obvious requirements for the backend are that it should be able to "deliver" the built svelte app to the client; and that it should be able to create an Excel/CSV file from client-side form data.

To build the svelte app:
```shell
cd ..
npm run build
```

The app's REST endpoint `/api/v1/owner_surrender_form/` takes a JSON owner surrender form and saves it as a CSV file.  The file name is the digest of the CSV content.  The output directory, relative to the directory containing this README, is `./data/out/intake_forms`.
