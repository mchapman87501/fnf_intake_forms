from pathlib import Path

from fastapi import FastAPI, APIRouter, Depends
from fastapi.staticfiles import StaticFiles

from .serverlib.owner_surrender_form import OwnerSurrenderForm

# The main app serves static files from the "/" URL path,
# and api calls from "/api".

# TODO consider bundling svelte front-end into a built Python package,
# and importing the front-end content using importlib.resources.

_here = Path(__file__).resolve().parent
front_end_root = _here.parent.parent / "build"

api_app = APIRouter(prefix="/api")

# Handling complex forms:
# https://www.reddit.com/r/FastAPI/comments/hs6kpj/comment/fy9a6x9/?utm_source=share&utm_medium=web2x&context=3

@api_app.post("/owner_surrender_form/")
async def get_intake_form(form_data: OwnerSurrenderForm):
    """
    Take in an owner surrender form and return a completed intake form.

    This is an aspirational docstring.
    """
    print("In get_intake_form", form_data)
    return f"TBD: Received form {form_data}"


app = FastAPI()
app.include_router(api_app)
app.mount("/", StaticFiles(directory=front_end_root, html=True), name="static")

