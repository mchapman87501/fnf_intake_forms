import type { RequestEvent } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { addAccessToken, addRefreshToken, newAccessToken, newRefreshToken } from '$lib/hooks/tokens.server'
// To fix 405 error:
// https://stackoverflow.com/a/73755196
// +page.server.ts should export const actions.
// +server.ts (like this file) should still use
// function POST.

export async function POST(event: RequestEvent): Promise<Response> {
    let formParams: { [index: string]: any } = await event.request.formData()
    console.log("yalnets form params: %o", formParams)

    const accessToken = newAccessToken(formParams["username"])
    const refreshToken = newRefreshToken()
    let headers = new Headers()
    addAccessToken(headers, accessToken)
    addRefreshToken(headers, refreshToken)

    const body = JSON.stringify({"access_token": accessToken, "token_type": "bearer"})
    const resp = new Response(body, {status: 200, headers: headers})
    console.log("Yalnets: %o", resp)
    return resp
}
