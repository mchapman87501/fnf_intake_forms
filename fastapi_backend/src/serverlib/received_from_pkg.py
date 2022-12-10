from pydantic import BaseModel, Field


class ReceivedFromPkg(BaseModel):
    received_from_name: str = Field(alias="fromName")
    drivers_license_no: str = Field(alias="driversLic")
    street_address: str = Field(alias="address")
    home_phone: str = Field(alias="phone")
    city: str
    state: str
    zipcode: str = Field(alias="zip")
    email_addr: str = Field(alias="email")
