import type { RequestEvent } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'

import type { SurrenderPkg } from 'src/infrastructure/info_packages'
import { processRescueSurrender } from '$lib/api_support/surrender_processing'

export async function POST(event: RequestEvent): Promise<Response> {
	try {
		const formParams: SurrenderPkg = await event.request.json()
		return json(await processRescueSurrender(formParams))
	} catch (e: any) {
		console.error(e.message)
		return json('Failed to save rescue surrender information', { status: 500 })
	}
}
