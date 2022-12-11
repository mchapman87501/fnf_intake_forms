from pydantic import BaseModel, Field

# Try to map front-end's
# "catPkg" store fields into the backend.


class CatPkg(BaseModel):
    intake_date: str = Field(alias="intakeDate")
    cat_name: str = Field(alias="catName")
    treatable_medical: bool = Field(alias="treatableMedical", default=False)
    dob: str = Field(alias="DOB")
    gender: str = ""
    altered: str = ""
    altered_date: str = Field(alias="alteredDate")
    # ...
    intake_fnf_repr: str = Field(alias="intakeFnFRepr")
    # etc.
