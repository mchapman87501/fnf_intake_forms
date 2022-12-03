from pydantic import BaseModel

# For clues on how to map JSON camelcase to
# Python's preferred snakecase, where needed:
# https://medium.com/analytics-vidhya/camel-case-models-with-fast-api-and-pydantic-5a8acb6c0eee
class BaseSurrenderForm(BaseModel):
    surrender_date: str
    drivers_license_no: str