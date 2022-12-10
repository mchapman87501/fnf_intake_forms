import datetime

from .base_surrender_form import BaseSurrenderForm
from .intake_form import IntakeForm


class OwnerSurrenderForm(BaseSurrenderForm):
    def to_intake_form(self) -> IntakeForm:
        return IntakeForm(
            intake_date=datetime.date.today(),
            intake_by=self.accepting_user,
            received_from=self.received_from_name,
            phone_num=self.home_phone,
            email=self.email_addr,
            reason=self.reason_for_surrender,
            surrender_transfer_stray="Owner Surrender",
            # ...
            name_of_cat=self.cat_name,
            date_of_birth=self.cat_age,
            gender=self.cat_gender,
        )
