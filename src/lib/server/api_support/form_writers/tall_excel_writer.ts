// Write Excel files in a standard 3-column format.
import * as exceljs from 'exceljs'
import { getDownloadInfo } from '$lib/api_support/download_info'

export interface Row {
	name: string
	value: string
	comments: string
}

//----------------------------------------------------------------------
// Helper functions
export function row(name: string, value: string): Row {
	return { name: name, value: value, comments: '' }
}

export async function writeFile(pathname: string, worksheetName: string, records: Row[]) {
	const wb = new exceljs.Workbook()
	const sheet = wb.addWorksheet(worksheetName)
	sheet.properties.defaultColWidth = 32
	sheet.columns = [
		{ header: '', key: 'name' },
		{ header: 'INFO', key: 'info' },
		{ header: 'COMMENTS', key: 'comments' }
	]
	records.forEach((row) => {
		sheet.addRow({ name: row.name, info: row.value, comments: row.comments })
	})

	await wb.xlsx.writeFile(pathname)
	return getDownloadInfo(pathname)
}
