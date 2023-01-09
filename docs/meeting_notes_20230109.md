# F&F Update 20230109

## Current Workflow

Someone fills out the paper surrender form. They may give the relinquisher a printed intake form, as a receipt, that they can sign.

Someone brings in the surrender form.
Someone re-keys into a standard intake form.

Lisa transfers the intake to a consolidated, one-row-per-record, intake workbook.

The app needs to generate an intake form CSV using the same one-row-per-record format used by the intake workbook.

(To emphasize: the CSV needs to use the same sequence of columns as the intake workbook uses.)

The app should continue to provide the three-column surrender and intake form CSVs, as well.

## Email

The user who fills out the various surrender forms needs to be able to send an email with attachments:

- one-row-per-record intake form CSV
- photo of cat, if available
- three-column surrender and intake form CSVs

For now, it may suffice for the app to download the CSVs to the user's device; and to leave it to them to compose the email.

The intake form needs to include an **automatically-generated surrender ID**.

## CSV Filenames

The surrender and intake CSV file names should have these components:

- `"H"` - healthy or `"TM"` - treatable medical
- Six-digit date of intake: `mmddyy`
- If cat came from anywhere other than a shelter, `"P"` followed by an ID number unique for that date
- Else if cat came from a shelter, then the shelter code (see below) followed by an ID number unique for that date
  - Two digits will suffice for the unique number.

In other words, the CSV filenames need to have this prefix:

`<health_code>-<mmddyy>-<shelter-code><day_unique_id>`

### Other Filename Components

(We did not discuss this in the meeting. -- Mitch)

To help distinguish different CSVs representing a single intake, filenames may also need a "form type" component. E.g., `surrender` or `intake`. So a complete CSV filename would have the form

`<health_code>-<mmddyy>-<shelter-code><day_unique_id>-<form_type>.csv`

Example: `H-010923-P-1234-surrender.csv`

### Organization Abbreviations

- P - "Public" (no shelter)
- ROS - Roswell
- EH - Espanola Animal Shelter
- FK - Fat Kats
- KHS - Kansas Humane Society
- ART - Paws & Claws Artesia
- SFAS - Santa Fe
- SNC - S Fe Spay / Neuter Center
- SCH - Streetcat Club
- VC - Valencia County

## What About Photos?

It would be nice to be able to include a photo of the cat(s) as part of the submission email.

## Be Able to Work Offline

Eventually, users need to be able to use the app without an internet connection. This is not a requirement for the next prototype.

## Target Devices

Although the app's user interface should be usable from a smartphone, it should be designed primarily for a tablet.

## Requirements Recap

The app must do the following things for each animal:

- Generate a unique surrender ID
- Provide a single-row intake CSV file
  - Use the same sequence of columns as the existing intake workbook
- Provide three-column surrender and intake CSV files
- Enable the app user to provide a photo of the surrendered cat
- Use the same filename scheme for all files associated with a surrender
  - `<health_code>-<mmddyy>-<shelter-code><day_unique_id>-<form_type>`

# Next Steps

Implement the filename scheme.
Get email with CSV attachments working.
Get next rev up on some hosting provider (e.g., AWS).
Send Lisa the URL.

Get cat photo upload working.
Add cat photo (if any) to generated emails.
Ensure the UI is usable on tablet and phone form factors.
