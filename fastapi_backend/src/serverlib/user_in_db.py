import os
from pathlib import Path
import sqlite3
import typing as tp

from pydantic import Field, BaseSettings
from passlib.context import CryptContext

from .user import User

# This is only a prototype.

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class _Settings(BaseSettings):
    db_pathname: str = Field(env="user.db.path", default=os.fspath(Path.cwd() / "user.db"))
    admin_username: str = Field(env="admin.username")
    admin_default_pass: str = Field(env="admin.password")

    class Config:
        # For use in docker:
        secrets_dir = "/run/secrets"

        # In case docker doesn't provide a value:
        env_file = ".env"
        env_file_encoding = "utf-8"


_db_schema = """
CREATE TABLE IF NOT EXISTS Users(
    username TEXT NOT NULL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT,
    hpass TEXT NOT NULL,
    disabled BOOLEAN DEFAULT 0
)
"""


class _UserDB:
    def __init__(self, db_url: tp.Optional[str] = None):
        if db_url is None:
            db_url = f"file://{_Settings().db_pathname}"
        self._connection = sqlite3.connect(db_url, uri=True)
        self._connection.row_factory = sqlite3.Row

        cursor = self._connection.cursor()
        self._init_schema(cursor)
        self._add_default_user(cursor)

    def __del__(self):
        self._connection.close()

    def __enter__(self) -> "_UserDB":
        return self

    def __exit__(self, *args, **kw) -> bool:
        self._connection.close()
        return False

    def _cursor(self) -> sqlite3.Cursor:
        return self._connection.cursor()

    def _init_schema(self, cursor: sqlite3.Cursor) -> None:
        cursor.executescript(_db_schema)

    def _add_default_user(self, cursor: sqlite3.Cursor) -> None:
        settings = _Settings()
        username = settings.admin_username
        self.add_user(
            username=username,
            full_name="Admin",
            email=None,
            hpass=_pwd_context.hash(settings.admin_default_pass),
        )

    def add_user(
        self,
        *,
        username: str,
        full_name: str,
        email: str | None,
        hpass: str,
        disabled: bool = False,
    ) -> bool:
        query = """
        INSERT INTO Users
        (username, full_name, email, hpass, disabled)
        VALUES (?, ?, ?, ?, ?)
        """
        self._cursor().execute(query, [username, full_name, email, hpass, disabled])
        return True

    def get_user(self, username: str) -> tp.Optional[dict]:
        cursor = self._cursor()
        cursor.execute("SELECT * FROM Users WHERE username = ?", [username])
        for row in cursor:
            return row


class UserInDB(User):
    hpass: str

    @classmethod
    def retrieve(cls, username: str) -> tp.Optional["UserInDB"]:
        with _UserDB() as db:
            record = db.get_user(username)
            if record is not None:
                return cls(**record)
        return None

    @classmethod
    def authenticate(cls, username: str, password: str) -> tp.Optional["UserInDB"]:
        user = cls.retrieve(username)
        if (user is not None) and _pwd_context.verify(password, user.hpass):
            return user
        return None
