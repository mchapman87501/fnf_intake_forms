import datetime

from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from pydantic import BaseModel, BaseSettings, Field

from .user_in_db import User, UserInDB
from .oauth_impl import oauth2_scheme

# TODO Support JWT refresh tokens.

class _Settings(BaseSettings):
    secret_key: str = Field(env="jwt.access.token.secret")
    access_expire_minutes: int = Field(env="jwt.access.token.duration", default=60 * 4)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

ALGORITHM = "HS256"


class Token(BaseModel):
    access_token: str

    @classmethod
    def create_access_token(cls, subject: str, minutes_to_live: int | None = None) -> str:
        settings = _Settings()
        if minutes_to_live is None:
            minutes_to_live = settings.access_expire_minutes
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=minutes_to_live)
        to_encode = {"sub": subject, "exp": expire}
        result = jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)
        return result


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, _Settings().secret_key, algorithms=[ALGORITHM])
        username: str = payload.get("sub")  # type: ignore

        print("get_current_user - payload:", payload)
        print("get_current_user - username:", username)
        if username is None:
            raise cred_exc
    except JWTError as info:
        print("get_current_user - error:", info)
        raise cred_exc

    user = UserInDB.retrieve(username)
    if user is None:
        raise cred_exc
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive User")
    return current_user
