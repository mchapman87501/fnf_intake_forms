import datetime

from .base_surrender_form import BaseSurrenderForm
from .intake_form import IntakeForm
class OwnerSurrenderForm(BaseSurrenderForm):
    owner_name: str

    def to_intake_form(self) -> IntakeForm:
        return IntakeForm(
            intake_date=datetime.date.today(),
            intake_by=self.accepting_user,
            received_from=self.owner_name,
            phone_num=self.home_phone,
            email=self.email_addr,
            reason=self.reason_for_surrender,
        )