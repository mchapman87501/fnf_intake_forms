import { row, writeFile, type Row } from './tall_excel_writer'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import type { DownloadInfo } from '$lib/api_support/download_info'

function getStrayFormRows(info: SurrenderPkg): Row[] {
	return [row('TBD', '')]
}

/**
 * Save a stray surrender document.
 * @param info Description of the surrender
 * @param pathname Where to write the surrender document
 * @returns a promise of the Download info for the surrender document
 */
export async function saveStraySurrenderForm(
	info: SurrenderPkg,
	pathname: string
): Promise<DownloadInfo> {
	const records = getStrayFormRows(info)
	return writeFile(pathname, 'Stray Surrender Form', records)
}
