import datetime
from io import StringIO
import csv
import typing as tp

from pydantic import BaseModel, Field
from pydantic.fields import FieldInfo


# Should these fields be some custom class with a "comments" metadata attr?
class IntakeForm(BaseModel):
    intake_date: datetime.date = Field(datetime.date.today(), title="Intake Date")
    intake_by: str = Field("Unknown", title="Intake By")
    received_from: str = Field("Unknown", title="Received From")
    phone_num: str = Field("Unknown", title="Phone #")
    email: str = Field("Unknown", title="e-mail")
    reason: str = Field("Unknown", title="Reason")
    surrender_transfer_stray: str = Field("Unknown", title="Surrender/Transfer/Stray")
    # Etc.

    # Does this belong elsewhere?  How tightly should data models be coupled
    # with representation generators?
    def as_csv(self) -> str:
        outf = StringIO()
        writer = csv.writer(outf, dialect=csv.excel)

        writer.writerow(["", "INFO", "COMMENTS"])

        schema = self.schema()
        for prop_name, prop in schema['properties'].items():
            title = prop["title"] or "<no title>"
            value = getattr(self, prop_name)
            writer.writerow([title, value, ""])

        return outf.getvalue()

