import type { RequestEvent } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import { saveIntakeForm } from '$lib/api_support/intake_form_writer'

export async function POST(event: RequestEvent): Promise<Response> {
	const formParams: { [index: string]: any } = await event.request.json()

	try {
		// TODO Also save the rescue surrender form.  It may have info not captured in the intake form.

		const info = await saveIntakeForm(formParams)
		return json(info)
	} catch (e: any) {
		console.error(e.message)
		return json('Failed to save intake record', { status: 500 })
	}
}
