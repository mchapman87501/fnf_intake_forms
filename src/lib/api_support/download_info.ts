import * as path from 'path'

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
	const downloadMSec = 1000
	// Automatically download the generated intake form.
	// https://stackoverflow.com/a/42274086/2826337
	const downloadResp = await fetch(downloadInfo.srcURL, {
		signal: AbortSignal.timeout(downloadMSec)
	})
	if (downloadResp.status == 200) {
		// Need to do this in order to save to downloadInfo.filename, instead
		// of saving to a randomly generated UUID.
		const anchor = document.createElement('a')
		anchor.href = window.URL.createObjectURL(await downloadResp.blob())
		anchor.download = downloadInfo.filename

		// Kludge: Safari on macOS doesn't always complete all downloads.
		// Add a delay to allow time for anchor.click() to complete.
		const timeoutPromise = new Promise((resolve, _) => {
			window.setTimeout(() => {
				resolve('timeout completed')
			}, 100)
		})
		anchor.click()
		try {
			await timeoutPromise
		} catch (e: unknown) {
			// Ignore
		}
	} else {
		throw new Error(`Failed to download ${downloadInfo.srcURL}: ${downloadResp.statusText}`)
	}
}
