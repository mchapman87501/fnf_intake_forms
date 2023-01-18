import { writeTallCSV, row, type CSVRow } from '$lib/api_support/form_writers/tall_csv_writer'
import type { SurrenderPkg } from 'src/infrastructure/info_packages'
import { getDownloadInfo, type DownloadInfo } from '$lib/api_support/download_info'

function getStrayFormRows(info: SurrenderPkg): CSVRow[] {
	return [row('TBD', '')]
}

export async function saveStraySurrenderForm(
	info: SurrenderPkg,
	csvPathname: string
): Promise<DownloadInfo> {
	const records = getStrayFormRows(info)
	await writeTallCSV(csvPathname, records)
	return getDownloadInfo(csvPathname)
}
