import type { DownloadInfo } from './download_info'

export type SurrenderDownloads = {
	surrender: DownloadInfo
	surrenderPDF?: DownloadInfo
	intake: DownloadInfo
	intakeSingleRow: DownloadInfo
}
