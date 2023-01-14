import path from 'path'
import fsPromises from 'fs/promises'
import type { RequestEvent } from '@sveltejs/kit'

import { FormFileNamer } from '$lib/api_support/form_file_namer'

export async function GET(event: RequestEvent): Promise<Response> {
	const filename = event.params.filename

	if (filename !== undefined) {
		const csvPathname = path.join(FormFileNamer.dataDir, filename)
		try {
			const content = await fsPromises.readFile(csvPathname, { encoding: 'utf-8' })
			const headers = { status: 200, 'Content-Type': 'text/csv' }
			return new Response(content, headers)
		} catch (e) {
			console.error('Could not return contents of %o: %o', csvPathname, e)
		}
	}

	return new Response('Internal Error', { status: 500 })
}
