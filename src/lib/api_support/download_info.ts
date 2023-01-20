import * as path from 'path'
import { jwtSession } from '$lib/auth'
export type DownloadInfo = {
	srcURL: string
	filename: string
}

// Intended for server-side:
export function getDownloadInfo(pathname: string): DownloadInfo {
	const filename = path.basename(pathname)
	return {
		srcURL: encodeURI(`/api/v1/download/${filename}`),
		filename: filename
	}
}

// Intended for client-side:
export async function downloadCompletedForm(downloadInfo: DownloadInfo) {
	// Automatically download the generated intake form.
	// https://stackoverflow.com/a/42274086/2826337
	const options = {
		headers: { ...jwtSession() }
	}
	const downloadResp = await fetch(downloadInfo.srcURL, options)
	if (downloadResp.status == 200) {
		// Need to do this in order to save to downloadInfo.filename, instead
		// of saving to a randomly generated UUID.
		const anchor = document.createElement('a')
		anchor.href = window.URL.createObjectURL(await downloadResp.blob())
		anchor.download = downloadInfo.filename
		anchor.click()
	} else {
		console.error('Failed to download %o: %o', downloadInfo.srcURL, downloadResp.statusText)
	}
}
