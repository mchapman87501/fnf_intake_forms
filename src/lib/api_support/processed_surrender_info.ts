export type ProcessedSurrenderInfo = {
	surrenderID: string
	surrenderType: string // E.g., "Rescue" or "Stray"
	surrenderFormPath: string // Pathname of the CSV surrender form -- an owner-surrender, stray, rescue, etc., CSV
	intakeFormPath: string // Pathname of the intake form
	photoPath: string | null // Optional pathname to a photo of the cat
}