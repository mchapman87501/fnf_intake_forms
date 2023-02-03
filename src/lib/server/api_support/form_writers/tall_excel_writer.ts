// Write Excel files in a standard 3-column format.

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

// exceljs has import problems in some build environments?
// https://github.com/alexfauquette/mui-x/commit/4b9d769d2352b01a2de7c8957fc7d891ac0a5e92
async function getExcelJS() {
	const { default: excelJsDefault } = await import('exceljs')
	return excelJsDefault
}

// import * as exceljs from 'exceljs'

export async function writeFile(pathname: string, worksheetName: string, records: Row[]) {
	const exceljs = await getExcelJS()
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
