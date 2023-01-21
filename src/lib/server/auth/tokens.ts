import jwt from 'jsonwebtoken'

export type TokensServerConfig = {
	isDevEnv: boolean
	accessSecret: string
	accessMinutes: number
}

let config: TokensServerConfig = {
	isDevEnv: true,
	accessSecret: 'uninitialized',
	accessMinutes: NaN
}

export function configure(newValue: TokensServerConfig) {
	config = newValue
}

/**
 * Get a duration, in seconds.
 * @param minutes The desired duration as a real number of minutes (and fractions)
 * @param defaultVal The fallback value to use if minutes is NaN
 * @returns The given duration in seconds
 */
function duration(minutes: number, defaultVal: number): number {
	if (isNaN(minutes)) {
		minutes = defaultVal
	}
	return minutes * 60
}

export type Payload = {
	username: string
}

function newToken(username: string, secret: string, durationSecs: number): string {
	const payload: Payload = {
		username: username
	}
	return jwt.sign(payload, secret, { expiresIn: `${durationSecs}s` })
}

function sessionTokenDuration(): number {
	const dfltMinutes = 60 * 4
	return duration(config.accessMinutes, dfltMinutes)
}

export function newSessionToken(username: string): string {
	return newToken(username, config.accessSecret, sessionTokenDuration())
}

function secureSetting(): string {
	// Development vs. production.
	// See https://kit.svelte.dev/docs/modules#$app-environment-dev
	return config.isDevEnv ? '' : ' Secure;'
}

function verifyToken(token: string, secret: string, title: string): any | null {
	try {
		return jwt.verify(token, secret)
	} catch (e) {
		let details = `$e`
		if (e instanceof jwt.JsonWebTokenError) {
			details = e.message
		}
		// Missing, invalid or expired token
		console.warn(`Could not verify ${title} token: ${details}`)
	}
	return null
}

export const sessionCookieName = 'sess_tok'

export function addSessionToken(headers: Headers, sessTok: string) {
	const secure = secureSetting()
	const maxAgeSeconds = sessionTokenDuration()
	const cookie = `${sessionCookieName}=${sessTok}; Max-Age=${maxAgeSeconds}; Path=/; ${secure} HttpOnly`
	headers.set('set-cookie', cookie)
}

export function clearSessionToken(headers: Headers) {
	headers.set('set-cookie', `${sessionCookieName}=; Max-Age=0; Path=/; ${secureSetting()} HttpOnly`)
}

export function verifySessionToken(token: string): any | null {
	return verifyToken(token, config.accessSecret, 'session')
}

export function sessionUsernameFromToken(sessTok: string | undefined): string | null {
	if (sessTok !== undefined) {
		const payload = verifySessionToken(sessTok)
		if (payload !== null) {
			return payload.username
		}
	}
	return null
}

export function addSessionTokenForUsername(headers: Headers, username: string) {
	const token = newSessionToken(username)
	addSessionToken(headers, token)
}

export function invalidTokenResponse() {
	const headers = new Headers()
	clearSessionToken(headers)
	return new Response(null, { status: 401, headers: headers })
}
