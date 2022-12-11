from pydantic import BaseModel

from .cat_pkg import CatPkg
from .received_from_pkg import ReceivedFromPkg

from .intake_form import IntakeForm


# For clues on how to map JSON camelcase to
# Python's preferred snakecase, where needed:
# https://medium.com/analytics-vidhya/camel-case-models-with-fast-api-and-pydantic-5a8acb6c0eee
class BaseSurrenderForm(BaseModel):
    cat_info: CatPkg
    received_from: ReceivedFromPkg

    def to_intake_form(self) -> IntakeForm:
        return IntakeForm(
            intake_date=self.cat_info.intake_date,
            received_by=self.cat_info.intake_fnf_repr,
            received_from=self.received_from.received_from_name,
            street_address=self.received_from.street_address,
            state=self.received_from.state,
            zipcode=self.received_from.zipcode,
            phone=self.received_from.phone,
            email=self.received_from.email_addr,
            reason=self.received_from.surrender_type,
            shelter_number=self.received_from.shelter_num,
            # ...
            name_of_cat=self.cat_info.cat_name,
            date_of_birth=self.cat_info.dob,
            gender=self.cat_info.gender,
        )
