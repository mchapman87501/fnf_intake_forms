import { writeFnFCSV, row, type CSVRow } from '$lib/api_support/form_writers/fnf_csv_writer'
import type { SurrenderPkg } from 'src/infrastructure/info_packages'
import { getDownloadInfo, type DownloadInfo } from '$lib/api_support/download_info'

function getRescueFormRows(info: SurrenderPkg): CSVRow[] {
	return [row('TBD', '')]
}

export async function saveRescueSurrenderForm(
	info: SurrenderPkg,
	csvPathname: string
): Promise<DownloadInfo> {
	const records = getRescueFormRows(info)
	await writeFnFCSV(csvPathname, records)
	return getDownloadInfo(csvPathname)
}
