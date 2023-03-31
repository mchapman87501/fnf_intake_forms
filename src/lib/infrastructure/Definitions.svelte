<script lang="ts" context="module">
	export const uynChoicesYes = 'Yes'
	export const uynChoicesUnknown = 'Unknown'
	export const uynChoices = [uynChoicesUnknown, uynChoicesYes, 'No']

	export const genderChoiceUnknown = 'F/M Unknown'
	export const genderChoiceFemale = 'Female'
	export const genderChoiceMale = 'Male'
	export const genderChoices = [genderChoiceUnknown, genderChoiceFemale, genderChoiceMale]

	export const surrenderChoiceTransfer = 'Transfer'
	export const surrenderChoiceSurrender = 'Surrender'
	export const surrenderChoicePregnant = 'Pregnant'
	export const surrenderChoiceRescue = surrenderChoiceTransfer
	export const surrenderChoiceStray = 'Stray'
	export const surrenderChoiceUnspecified = 'Unspecified'
	export const surrenderChoices = [
		surrenderChoiceUnspecified,
		surrenderChoiceSurrender,
		surrenderChoiceTransfer,
		surrenderChoiceStray,
		surrenderChoicePregnant
	]

	export const feralChoicesUnknown = 'Friendly/Feral Unknown'
	export const feralChoicesFriendlyOutgoing = 'Friendly-Outgoing'
	export const feralChoicesFriendlyShy = 'Friendly-Shy'
	export const feralChoicesSemiferal = 'Semi-feral'
	export const feralChoicesFeral = 'Feral'
	export const feralChoices = [
		feralChoicesUnknown,
		feralChoicesFriendlyOutgoing,
		feralChoicesFriendlyShy,
		feralChoicesSemiferal,
		feralChoicesFeral
	]
</script>
