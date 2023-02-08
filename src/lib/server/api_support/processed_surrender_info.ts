export type ProcessedSurrenderInfo = {
	rescueID: string
	catName: string
	surrenderType: string // E.g., "Rescue" or "Stray"
	surrenderFormPath: string // Pathname of the CSV surrender form -- an owner-surrender, stray, rescue, etc., CSV
	surrenderPDFPath: string
	intakeFormPath: string // Pathname of the intake form in Excel format
	intakeSingleRowFormPath: string // Pathname of the "wide" intake form
	photoPath?: string // Optional pathname to a photo of the cat
}
