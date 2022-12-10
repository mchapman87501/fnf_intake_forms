import type { RequestEvent } from "@sveltejs/kit"
import { json } from '@sveltejs/kit'

export const prerender = false

export async function POST(event: RequestEvent): Promise<Response> {

    let formParams: { [index: string]: any } = await event.request.json()
    console.log("Received form data: %o", formParams)
    return json("Result\r\nPretend CSV content")
}
