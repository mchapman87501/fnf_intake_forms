import datetime
import hashlib
from io import BytesIO
from pathlib import Path

from fastapi import FastAPI, APIRouter, Depends
from fastapi.staticfiles import StaticFiles

from .serverlib.owner_surrender_form import OwnerSurrenderForm

# The main app serves static files from the "/" URL path,
# and api calls from "/api".

# TODO consider bundling svelte front-end into a built Python package,
# and importing the front-end content using importlib.resources.

_here = Path(__file__).resolve().parent
backend_root = _here.parent
server_root = backend_root.parent
front_end_root = server_root / "build"

api_app = APIRouter(prefix="/api")

# Handling complex forms:
# https://www.reddit.com/r/FastAPI/comments/hs6kpj/comment/fy9a6x9/?utm_source=share&utm_medium=web2x&context=3


def save_intake_form(csv_text: str):
    print("Pretend to save intake form:")
    print(repr(csv_text))
    # Look, a 'database'.
    outdir = backend_root / "data" / "out" / "intake_forms"
    outdir.mkdir(exist_ok=True, parents=True)

    # Assume concurrent processing of requests.
    # Don't use sequential IDs, etc.
    # Avoid duplicate content:
    # identical csv_text's map to identical filenames.
    buff = BytesIO(csv_text.encode("utf8"))
    digest = hashlib.file_digest(buff, "sha256")
    hex = digest.hexdigest()
    outpath = outdir / (hex + ".csv")
    outpath.write_text(csv_text)


@api_app.post("/owner_surrender_form/")
async def get_intake_form(form_data: OwnerSurrenderForm):
    """
    Take in an owner surrender form and return a completed intake form.

    This is an aspirational docstring.
    """
    derived_intake_form = form_data.to_intake_form()
    csv = derived_intake_form.as_csv()
    save_intake_form(csv)
    return csv

app = FastAPI()
app.include_router(api_app)
app.mount("/", StaticFiles(directory=front_end_root, html=True), name="static")

