from src.serverlib.user_in_db import UserInDB

def test_default_user(monkeypatch, tmpdir) -> None:
    db_path = tmpdir / "test_user_db.sqlite3"
    assert not db_path.exists()

    monkeypatch.setenv("user.db.path", str(db_path))

    username = "fred-the-magnificent"
    passwd = "ignore this P@$$w0r3"
    monkeypatch.setenv("admin.username", username)
    monkeypatch.setenv("admin.password", passwd)

    record = UserInDB.retrieve(username)
    assert record is not None
    assert record.username == username
    assert record.email is None

    authed = UserInDB.authenticate(username, passwd)
    assert authed is not None
    assert authed.username == username

    assert db_path.exists()