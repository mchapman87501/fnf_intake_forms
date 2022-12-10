import type { RequestEvent } from "@sveltejs/kit"
import { json } from '@sveltejs/kit'

export const prerender = false

export async function POST(event: RequestEvent): Promise<Response> {
    const params = event.params
    const body = event.request.body
    console.log("Pretend to handle owner surrender form with params: %o, body: %o", params, body)
    return json("Result\r\nPretend CSV content")
}
