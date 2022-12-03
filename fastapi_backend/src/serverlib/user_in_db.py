import typing as tp

from .user import User

# Uh, this is only a prototype.

_by_username = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "no.reply@fnfsfe.org",
        "hpass": "fakehashedlog-me-in",
        "disabled": False,
    }
}

UserInDB = tp.TypeVar("UserInDB")  # type: ignore


class UserInDB(User):
    hpass: str

    @classmethod
    def hashita(cls, password: str) -> str:
        return f"fakehashed{password}"

    @classmethod
    def retrieve(cls, username: str) -> UserInDB | None:
        record = _by_username.get(username)
        if record is not None:
            return cls(**record)
