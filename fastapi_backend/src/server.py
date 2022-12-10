import hashlib
from io import BytesIO
from pathlib import Path

from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm

from .serverlib.owner_surrender_form import OwnerSurrenderForm
from .serverlib.user import User
from .serverlib.user_in_db import UserInDB
from .serverlib.jwt_token_mgmt import get_current_active_user, Token
from .serverlib.oauth_impl import oauth_endpoint

# The main app serves static files from the "/" URL path,
# and api calls from "/api".

# TODO consider bundling svelte front-end into a built Python package,
# and importing the front-end content using importlib.resources.

_here = Path(__file__).resolve().parent
backend_root = _here.parent
server_root = backend_root.parent
front_end_root = server_root / "build"

api_app = APIRouter(prefix="/api/v1")


# -----------------------------------------------------------------------
# OAuth2 authentication endpoint
@api_app.post("/" + oauth_endpoint)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    auth_fail = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not authenticate",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user = UserInDB.authenticate(form_data.username, form_data.password)
    if user is None:
        raise auth_fail
    access_token = Token.create_access_token(user.username)
    return {"access_token": access_token, "token_type": "bearer"}


# Find out whether the access token has expired.
@api_app.get("/check_in")
def check_in(current_user: User = Depends(get_current_active_user)):
    return "OK"


# -----------------------------------------------------------------------
# Handling complex forms:
# https://www.reddit.com/r/FastAPI/comments/hs6kpj/comment/fy9a6x9/?utm_source=share&utm_medium=web2x&context=3


def save_intake_form(csv_text: str):
    print("Saving:")
    print(repr(csv_text))
    # Look, a 'database'.
    outdir = backend_root / "data" / "out" / "intake_forms"
    outdir.mkdir(exist_ok=True, parents=True)

    # Assume concurrent processing of requests.
    # Don't use sequential IDs, etc.
    # Avoid duplicate content:
    # identical csv_text's map to identical filenames.

    # NB: hashlib.file_digest() is new in Python 3.11.

    buff = BytesIO(csv_text.encode("utf8"))
    digest = hashlib.file_digest(buff, "sha256")
    hex = digest.hexdigest()
    outpath = outdir / (hex + ".csv")
    outpath.write_text(csv_text)


@api_app.post("/owner_surrender_form")
async def get_intake_form(
    form_data: OwnerSurrenderForm,
    current_user: User = Depends(get_current_active_user),
):
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
