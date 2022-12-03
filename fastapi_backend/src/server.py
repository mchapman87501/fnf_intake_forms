import hashlib
from io import BytesIO
from pathlib import Path

from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from .serverlib.owner_surrender_form import OwnerSurrenderForm
from .serverlib.user import User
from .serverlib.user_in_db import UserInDB

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
# Authentication and authorization middleware.
oauth_token_url = "yalnets"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/{oauth_token_url}")


def fake_decode_token(token: str) -> UserInDB | None:
    return UserInDB.retrieve(token)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    user = fake_decode_token(token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive User"
        )
    return current_user


@api_app.post("/" + oauth_token_url)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print("In login")
    user = UserInDB.retrieve(form_data.username)
    auth_fail = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Could not authenticate",
    )
    if user is None:
        raise auth_fail
    hashed_pass = UserInDB.hashita(form_data.password)
    if hashed_pass != user.hpass:
        raise auth_fail
    return {"access_token": user.username, "token_type": "bearer"}


# -----------------------------------------------------------------------
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
