import datetime

from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from pydantic import BaseModel

from .user_in_db import User, UserInDB
from .oauth_impl import oauth2_scheme

SECRET_KEY = "idontbelonginvcs_d244bdb757114d0fa0cc9f893e251d31c2e6b106e7b0b8095f01bec7e205fd4a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class Token(BaseModel):
    access_token: str
    token_type: str

    @classmethod
    def create_access_token(cls, data: dict, expires_delta: datetime.timedelta | None = None) -> str:
        to_encode = data.copy()
        if expires_delta is None:
            expires_delta = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.datetime.utcnow() + expires_delta
        to_encode = data | {"exp": expire}
        result = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return result

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
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
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive User"
        )
    return current_user


