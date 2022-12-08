from fastapi.security import OAuth2PasswordBearer

oauth_endpoint = "yalnets"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/{oauth_endpoint}")
