import { createObjectCsvWriter } from 'csv-writer'

export type WideCSVColumn = {
	title: string
	value: string
}

//----------------------------------------------------------------------
// Helper functions
export function col(title: string, value: any): WideCSVColumn {
	return { title: title, value: value }
}

export async function writeWideCSV(csvPathname: string, columns: WideCSVColumn[]) {
	try {
		const csvHeaders = columns.map((col) => {
			return {
				id: col.title,
				title: col.title
			}
		})
		let row: { [key: string]: string } = {}
		for (const col of columns) {
			row[col.title] = col.value
		}
		// const csvHeaders = [
		// 	{ id: 'name', title: '' },
		// 	{ id: 'value', title: 'INFO' },
		// 	{ id: 'comments', title: 'COMMENTS' }
		// ]

		const fileWriter = createObjectCsvWriter({
			path: csvPathname,
			header: csvHeaders
		})
		await fileWriter.writeRecords([row])
	} catch (e: any) {
		console.error('Error writing wide CSV file %o: %o', csvPathname, e.message)
		throw e
	}
}
