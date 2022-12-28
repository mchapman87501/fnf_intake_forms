import type { RequestEvent } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import { saveIntakeForm } from '$lib/api_support/intake_form_writer'

export async function POST(event: RequestEvent): Promise<Response> {
	const formParams: { [index: string]: any } = await event.request.json()

	const catInfo = formParams['cat_info']
	const receivedFrom = formParams['received_from']

	try {
		const info = await saveIntakeForm(catInfo, receivedFrom)
		const body = JSON.stringify(info)
		return json(info)
	} catch (e: any) {
		console.error(e.message)
		return json('Failed to save intake record', { status: 500 })
	}
}
