# Overview

This is a prototype Python FastAPI backend for the intake form web service.

Why it's of interest: makes it easier to implement a REST API that can be used,
not only by the Svelte front-end, but by native mobile apps (Flutter, iOS, etc.)
that might be easier to use offline.

Things to investigate:
* Authentication/authorization in FastAPI
* Methods for producing Excel content
* (Possibly) methods for sending generated intake forms to other web services
  -- or to email addresses at F&F


## Stubbing in a new FastAPI Project

### Create a Python Virtual Environment
If you have `direnv` installed, it can use the `.envrc` file in this directory.

You could also use Python's [venv](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/#creating-a-virtual-environment).


### Install Packages

```python
python -m pip install -U pip
python -m pip install -r requirements.txt
```

### Start Coding

:)  See the [FastAPI Example](https://fastapi.tiangolo.com/#example).


## Keeping It Simple

So far the most obvious requirements for the backend are that it should be able to "deliver" the built svelte app to the client; and that it should be able to create a downloadable Excel/CSV file or fragment, from client-side form data.

```shell
cd ..
# Create downloadable svelte app assets in ../build.
npm run build
```

