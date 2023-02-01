import { row, writeFile, type Row } from './tall_excel_writer'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import type { DownloadInfo } from '$lib/api_support/download_info'

function getRescueFormRows(info: SurrenderPkg): Row[] {
	return [row('TBD', '')]
}

/**
 * Save a rescue surrender document.
 * @param info Description of the surrender
 * @param pathname Where to write the surrender document
 * @returns a promise of the Download info for the surrender document
 */
export async function saveRescueSurrenderForm(
	info: SurrenderPkg,
	pathname: string
): Promise<DownloadInfo> {
	const records = getRescueFormRows(info)
	return writeFile(pathname, 'Rescue Surrender Form', records)
}
