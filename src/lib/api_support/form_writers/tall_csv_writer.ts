// Write CSV files in a standrd three-column format.
import { createObjectCsvWriter } from 'csv-writer'

export interface CSVRow {
	name: string
	value: string
	comments: string
}

//----------------------------------------------------------------------
// Helper functions
export function row(name: string, value: string): CSVRow {
	return { name: name, value: value, comments: '' }
}

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
		throw e
	}
}
