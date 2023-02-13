// Periodically scrub old output files

import * as fsPromises from 'fs/promises'
import * as path from 'path'

import { FormFileNamer } from '../api_support/form_file_namer'

const scrubInterval = 1000 * 60 * 60 * 24 // msec/sec * sec/min * min/scrub_pass = msec/scrub_pass

const retirementMs = 1000 * 60 * 5 // age threshold for files to be removed.

export async function scrubOnce() {
	const nowDate = new Date()
	const nowMs = nowDate.getTime()

	const dataDir = FormFileNamer.dataDir
	const dir = await fsPromises.opendir(dataDir)
	for await (const direntry of dir) {
		if (direntry.isFile()) {
			const pathname = path.join(dataDir, direntry.name)
			const stat = await fsPromises.stat(pathname)
			const age = nowMs - stat.mtimeMs
			if (age >= retirementMs) {
				await fsPromises.unlink(pathname)
			}
		}
	}
}

// Async is just for consistency w. other configure functions
export async function configure() {
	setInterval(async () => {
		try {
			scrubOnce()
		} catch (e) {
			console.error('Failed to scrub: %o', e)
		}
	}, scrubInterval)
}
