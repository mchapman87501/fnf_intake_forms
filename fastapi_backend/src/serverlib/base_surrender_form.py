from pydantic import BaseModel


# For clues on how to map JSON camelcase to
# Python's preferred snakecase, where needed:
# https://medium.com/analytics-vidhya/camel-case-models-with-fast-api-and-pydantic-5a8acb6c0eee
class BaseSurrenderForm(BaseModel):
    surrender_date: str = "Unknown"
    drivers_license_no: str = "Unknown"
    street_address: str = "Unknown"
    home_phone: str = "Unknown"
    city: str = "Unknown"
    state: str = "Unknown"
    zipcode: str = "Unknown"
    work_phone: str = "Unknown"
    email_addr: str = "Unknown"

    cat_age: str = "Unknown"
    cat_name: str = "Unknown"
    cat_gender: str = "Unknown"

    accepting_user: str = "Unknown"

    reason_for_surrender: str = "Unknown"
