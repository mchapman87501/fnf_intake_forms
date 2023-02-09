<script lang="ts" context="module">
	export const uynChoicesYes = 'Yes'
	export const uynChoicesUnknown = 'Unknown'
	export const uynChoices = [uynChoicesUnknown, uynChoicesYes, 'No']

	export const genderChoiceFemale = 'Female'
	export const genderChoices = ['F/M Unknown', genderChoiceFemale, 'Male']

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
</script>
