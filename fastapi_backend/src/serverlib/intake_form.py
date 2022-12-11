import datetime
from io import StringIO
import csv

from pydantic import BaseModel, Field


# Should these fields be some custom class with a "comments" metadata attr?
class IntakeForm(BaseModel):
    # Dates are represented as strings.  TODO standardize format and parsing.
    intake_date: str = Field(datetime.date.today().strftime("%Y-%m-%d"), title="Intake Date")
    received_by: str = Field("Unknown", title="Received By")
    received_from: str = Field("Unknown", title="Received From")

    street_address: str = Field("Unknown", title="Street Address")
    city: str = Field("Unknown", title="City")
    state: str = Field("Unknown", title="State")
    zipcode: str = Field("Unknown", title="Zip code")
    phone: str = Field("Unknown", title="Cell/Home phone")
    email: str = Field("Unknown", title="Email Address")

    reason: str = Field("Unknown", title="Reason for surrender")
    # Not sure what to do with the front-end surrender-types.

    shelter_number: str = Field("Unknown", title="Shelter Number")

    # ...
    name_of_cat: str = Field("Unknown", title="Cat's name")
    date_of_birth: str = Field("Unknown", title="DOB")
    gender: str = Field("Unknown", title="Gender")
    # Etc.

    # Does this belong elsewhere?  How tightly should data models be coupled
    # with representation generators?
    def as_csv(self) -> str:
        outf = StringIO()
        writer = csv.writer(outf, dialect=csv.excel)

        writer.writerow(["", "INFO", "COMMENTS"])

        schema = self.schema()
        for prop_name, prop in schema["properties"].items():
            title = prop["title"] or "<no title>"
            value = getattr(self, prop_name)
            writer.writerow([title, value, ""])

        return outf.getvalue()
