// value conversion functions to help users of tall_csv_writer, wide_csv_writer

import { uynChoicesYes } from '$lib/infrastructure/Definitions.svelte'

export function boolStr(value: boolean | string | null): string {
	if (typeof value == 'string') {
		return value
	}
	return value === null ? 'Unknown' : value ? 'Yes' : 'No'
}

export function posNegStr(value: boolean | null): string {
	return value === null ? 'Unknown' : value ? 'Pos' : 'Neg'
}

// Convert from the standard 'yyyy-mm-dd' of an input[type="date"] to
// F&F's preferred 'mm-dd-yy'.
export function dateStr(value: string | null | undefined): string {
	if (value === undefined || value === null) {
		return ''
	}
	const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
	if (m) {
		const y4str = m.at(1) || '0000'
		const mstr = m.at(2)
		const dstr = m.at(3)
		return `${mstr}-${dstr}-${y4str.slice(2)}`
	}
	return value
}

/**
 * Get a formatted date, if its associated validity state is 'Yes'.
 * @param yesNoUnknown string telling whether the date is valid ('Yes')
 * @param browserDate date to be converted to F&F format
 * @returns formatted browserDate, if yesNoUnknown is 'Yes'; blank otherwise
 */
export function dateIfApplicable(yesNoUnknown: string, browserDate: string | undefined): string {
	if (boolStr(yesNoUnknown).toLowerCase() == uynChoicesYes.toLowerCase()) {
		return dateStr(browserDate)
	}
	return ''
}
