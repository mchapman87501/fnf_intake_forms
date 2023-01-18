// Write CSV files in a standrd three-column format.
import { createObjectCsvWriter } from 'csv-writer'

export interface CSVRow {
	name: string
	value: any
	comments: string
}

//----------------------------------------------------------------------
// Helper functions
export function row(name: string, value: any): CSVRow {
	return { name: name, value: value, comments: '' }
}

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
export function dateStr(value: string): string {
	const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
	if (m) {
		const y4str = m.at(1) || '0000'
		const mstr = m.at(2)
		const dstr = m.at(3)
		return `${mstr}-${dstr}-${y4str.slice(2)}`
	}
	return value
}

//----------------------------------------------------------------------

/**
 * Write CSV records in the standard 3-column format used by
 * Felines & Friends:
 *  * Name - the name of some intake/surrender property, e.g., "Cat Name"
 *  * Value - the corresponding value, e.g., "Felix"
 *  * Comment - a blank column for free-form data to be entered separately
 * @param csvPathname Where to write CSV data
 * @param records Records to be written
 */
export async function writeTallCSV(csvPathname: string, records: CSVRow[]) {
	try {
		const csvHeaders = [
			{ id: 'name', title: '' },
			{ id: 'value', title: 'INFO' },
			{ id: 'comments', title: 'COMMENTS' }
		]

		const fileWriter = createObjectCsvWriter({
			path: csvPathname,
			header: csvHeaders
		})
		await fileWriter.writeRecords(records)
	} catch (e: any) {
		console.error('Error writing CSV file %o: %o', csvPathname, e.message)
	}
}
