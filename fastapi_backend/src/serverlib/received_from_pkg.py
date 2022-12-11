from pydantic import BaseModel, Field


class ReceivedFromPkg(BaseModel):
    received_from_name: str = Field(alias="fromName")
    drivers_license_no: str = Field(alias="driversLic")
    street_address: str = Field(alias="address")
    city: str
    state: str
    zipcode: str = Field(alias="zip")
    phone: str = Field(alias="phone")
    text_ok: bool = Field(alias="textOK", default=False)
    email_addr: str = Field(alias="email")
    donation_amount: str = Field(alias="donationAmount")
    donation_form: str = Field(alias="donationForm")
    surrender_type: str = Field(alias="surrenderType")
    location_of_rescue: str = Field(alias="locationOfRescue")
    description_of_rescue: str = Field(alias="descriptionOfRescue")
    shelter_num: str = Field(alias="shelterNum")
    shelter_prev_id: str = Field(alias="shelterPrevID")
    courtesy_listing: bool = Field(alias="courtesyListingNoRelinquishment", default=False)
    wants_mom_back: bool = Field(alias="wantsMomBack", default=False)
