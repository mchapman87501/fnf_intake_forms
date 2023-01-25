# F&F Update 20230125

# Status

Here's an update on the next steps from the last meeting:

Done:

- Implement the filename scheme.
- Get email with CSV attachments working.
- Get next rev up on some hosting provider (e.g., AWS).
- Send Lisa the URL.

Not Done:

- Get cat photo upload working.
- Add cat photo (if any) to generated emails.
- Ensure the UI is usable on tablet and phone form factors.

# New Things

(Let Lisa use the interface, discover issues.)

## Issues

## General

Try to make the forms as identical in layout as possible -- muscle memory.

Donation etc. should still go at the end.

### Web Surrender Form

For dates -- really need to be able to say "yes, tested; but I don't know when" -- allow to leave the date blank. But it's okay to force them to estimate a date of birth.

Current on shots -- need to be able to enter dates on the surrender form. Rabies, etc.

Checkbox should come first, then the text.

Treatable medical should come first. Probably should be closer to Current diet / meds.

Bite history belongs on all of the online surrender forms.

### Web Rescue Form

### Web Intake Form

Hide this for now.

### CSV Intake Forms

Spay/Neuter Date should be blank if "altered" is unknown.

Location: where is the cat after surrender?

Can add a column to the single-row to record the F&F representative.

Maybe add a set of columns at the end, with this extra info.

Generate the 3-column forms as Excel documents instead of as CSV, because these will be printed.

Be able to print the CSV forms as something that looks like the printed intake form. HTML->PDF?

Rabies info varies: Lisa would be fine with "Rabies expires" date.

### Email

Subject line should include the generated ID and the cat's name.

## My Questions

Q: Is there any need for forms to be saved / accessible after they have been downloaded and emailed?
A: Forms can be deleted as soon as they have been emailed.

Q: Do we need to support multiple users? Should the current user's name auto-fill the "F & F Representative" fields?
A: Single login is fine. Let people just write their names in.

Q: Should all of the downloads be combined into a single zip download?
A: Separate files are better.

# Next Steps

Make web form layouts identical, to the extent possible.

Let users specify "unknown" for all dates except cat DOB. In emailed documents, leave any "unknown" dates blank.

Present the rabies vaccination date as an expiration date.

In emailed documents, leave the spay/neuter date blank when the spay/neuter status is "unknown".

Append a column to the single-row CSV (the "Google sheet" document), for the name of the receiving F & F Representative.

Generate the 3-column forms as Excel documents, to make it easier to print them with cell borders.

Explore the feasibility of creating/emailing PDF versions of the current paper forms, with fields filled in.

Ensure that the subject for automatic emails includes both the rescue ID and the cat's name.

Get cat photo upload working.

Add cat photo (if any) to generated emails.

Ensure the UI is usable on tablet and phone form factors.
