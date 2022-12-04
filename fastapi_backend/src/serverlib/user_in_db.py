import typing as tp

from passlib.context import CryptContext

from .user import User

# Uh, this is only a prototype.

_by_username = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "no.reply@fnfsfe.org",
        "hpass": "$2b$12$hMxtpdXYEGMCZmis5WnhHOYrf8eoP89uZIM4ppOi8fxrSJXIwWiFW",
        "disabled": False,
    }
}


UserInDB = tp.TypeVar("UserInDB")  # type: ignore


class UserInDB(User):
    hpass: str

    @staticmethod
    def _pwd_context():
        return CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def _hashita(cls, password: str) -> str:
        return cls._pwd_context().hash(password)

    @classmethod
    def _verify_password(
        cls, plain_password: str, hashed_password: str
    ) -> bool:
        return cls._pwd_context().verify(plain_password, hashed_password)

    @classmethod
    def retrieve(cls, username: str) -> UserInDB | None:
        record = _by_username.get(username)
        if record is not None:
            return cls(**record)

    @classmethod
    def authenticate(cls, username: str, password: str) -> UserInDB | None:
        user = cls.retrieve(username)
        if (user is not None) and cls._verify_password(password, user.hpass):
            return user
        return None
