// Write CSV files in a standrd three-column format.
import { createObjectCsvWriter } from 'csv-writer'
import path from 'path'
import fsPromises from 'fs/promises'

const dataDir = path.join(process.cwd(), 'data', 'out')

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

// Create a sanitized filename from a rawStem string.
export function getCSVFilename(rawStem: string): string {
	// Needed: filename sanitization rules.
	const validStemChars = Array.from(rawStem).flatMap((c) => {
		if (c.match(/(\w|-)/)) {
			return c
		} else if (c.match(/\s/)) {
			return '_'
		} else {
			return ''
		}
	})
	return validStemChars.join('').replaceAll(/[_-][_-]+/g, '_') + '.csv'
}
//----------------------------------------------------------------------

export async function writeFnFCSV(filename: string, records: CSVRow[]) {
	const csvPathname = path.join(dataDir, filename)
	try {
		await fsPromises.mkdir(dataDir, { recursive: true })

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
