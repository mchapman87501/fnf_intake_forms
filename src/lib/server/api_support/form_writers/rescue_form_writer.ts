import { writeTallCSV, row, type CSVRow } from './tall_csv_writer'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import { getDownloadInfo, type DownloadInfo } from '$lib/api_support/download_info'

function getRescueFormRows(info: SurrenderPkg): CSVRow[] {
	return [row('TBD', '')]
}

export async function saveRescueSurrenderForm(
	info: SurrenderPkg,
	csvPathname: string
): Promise<DownloadInfo> {
	const records = getRescueFormRows(info)
	await writeTallCSV(csvPathname, records)
	return getDownloadInfo(csvPathname)
}