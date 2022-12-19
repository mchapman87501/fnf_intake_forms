import type { RequestEvent } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import {randomUUID} from 'crypto'
// See https://www.okupter.com/blog/environment-variables-in-sveltekit
import {JWT_ACCESS_TOKEN_SECRET, JWT_ACCESS_TOKEN_DURATION} from '$env/static/private'

// To fix 405 error:
// https://stackoverflow.com/a/73755196
// +page.server.ts should export const actions.
// +server.ts (like this file) should still use
// function POST.

export async function POST(event: RequestEvent): Promise<Response> {
    let formParams: { [index: string]: any } = await event.request.formData()
    console.log("yalnets form params: %o", formParams)
        // TODO accept form data, validate user, and return a valid JWT.
    const payload = {
        username: formParams["username"],
    }

    const durationMinutes = parseInt(JWT_ACCESS_TOKEN_DURATION)
    const durationMsecs = durationMinutes * 60 * 1000
    const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {expiresIn: `${durationMsecs}`})
    // Trying to follow https://dev.to/pilcrowonpaper/sveltekit-jwt-authentication-tutorial-2m34
    // The refreshToken needs to be stored in a transient "session" database.
    const refreshToken = randomUUID()

    const secure = '' // dev mode.  Use ' Secure;' for production.
    // I thought access tokens were not to be included in cookies...
    const result = { "access_token": accessToken, "token_type": "bearer" }
    const accessCookie = `token=${accessToken}; Max-Age=${15 * 60}; Path=/; ${secure} HttpOnly`
    const refreshCookie = `refresh_token=${refreshToken}; Max-Age=${30 * 24 * 60 * 60}; Path=/; ${secure} HttpOnly`
    let headers = new Headers()
    headers.set('set-cookie', refreshCookie)
    headers.set('set-cookie', accessCookie)

    const body = JSON.stringify(result)
    return new Response(body, {     status: 200, headers: headers})
}
