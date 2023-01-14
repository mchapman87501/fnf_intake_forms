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

export function boolStr(value: boolean | string | null) {
	if (typeof value == 'string') {
		return value
	}
	return value === null ? 'Unknown' : value ? 'Yes' : 'No'
}

export function posNegStr(value: boolean | null) {
	return value === null ? 'Unknown' : value ? 'Pos' : 'Neg'
}

//----------------------------------------------------------------------

export async function writeFnFCSV(csvPathname: string, records: CSVRow[]) {
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
