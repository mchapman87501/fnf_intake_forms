import type { RequestEvent } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import cookie from 'cookie'

// See https://www.okupter.com/blog/environment-variables-in-sveltekit
import { JWT_ACCESS_TOKEN_SECRET, JWT_ACCESS_TOKEN_DURATION } from '$env/static/private'

export function newAccessToken(username: string) {
	const payload = {
		username: username
	}

	const durationMinutes = parseInt(JWT_ACCESS_TOKEN_DURATION)
	const durationMsecs = durationMinutes * 60 * 1000
	return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: `${durationMsecs}` })
}

export function newRefreshToken() {
	// Trying to follow https://dev.to/pilcrowonpaper/sveltekit-jwt-authentication-tutorial-2m34
	// The refreshToken needs to be stored in a transient "session" database.
	const result = randomUUID()
	return result
}

function secureSetting(): string {
	return '' // dev mode.  Use ' Secure;' for production.
}

export function addAccessToken(headers: Headers, accessToken: string) {
	headers.set('Authorization', 'Bearer ' + accessToken)
}

export function addRefreshToken(headers: Headers, refreshToken: string) {
	const secure = secureSetting()
	const maxDays = 30
	const maxSeconds = maxDays * 24 * 60 * 60
	const refreshCookie = `refresh_token=${refreshToken}; Max-Age=${maxSeconds}; Path=/; ${secure} HttpOnly`
	headers.set('set-cookie', refreshCookie)
}

export function validAccessToken(event: RequestEvent): boolean {
	try {
		const fullAuthValue = event.request.headers.get('Authorization') || ''
		const token = fullAuthValue.replace(/^Bearer /, '')

		// const rawCookies = event.request.headers.get('cookie') || ''
		// const cookies = cookie.parse(rawCookies)
		const result = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET)
		return true
	} catch (e) {
		// Missing, invalid or expired token
		console.log('Could not validate access token: %o', e)
		return false
	}
}

export function invalidTokenResponse() {
	const secure = ''
	const headers = new Headers([
		['set-cookie', `refresh_token=; Max-Age=0; Path=/;${secure} HttpOnly`]
	])
	return new Response(null, { status: 401, headers: headers })
}
