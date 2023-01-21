import { beforeEach, describe, expect, test } from 'vitest'

import * as tokens from '$lib/server/auth/tokens'

describe('Test token basics', async () => {
	const defaultConfig: tokens.TokensServerConfig = {
		isDevEnv: true,
		accessSecret: '856d5b36c247841d6e9c8dc6acc07ab736a515162f3b7264f1bb9c376e0f049f',
		accessMinutes: 1
	}

	const defaultProdConfig = { ...defaultConfig, ...{ isDevEnv: false } }

	beforeEach(() => {
		tokens.configure(defaultConfig)
	})

	test('Create a new session token', () => {
		const username = 'Session User'
		const token = tokens.newSessionToken(username)
		expect(token).not.toBeNull()
		const payload = tokens.verifySessionToken(token)
		expect(payload).not.toBeNull()
		expect(payload.username).toBe(username)
	})

	test('Ignores non-numeric durations', () => {
		// Override default config.
		const config = {
			...defaultConfig,
			...{
				accessMinutes: parseInt('I am not a number')
			}
		}
		tokens.configure(config)
		const username = 'non-numeric duration user'
		const token = tokens.newSessionToken(username)

		// Duration should have units of seconds, and should use the internal
		// fallback value in tokens.sessionTokenDuration
		const payload = tokens.verifySessionToken(token)
		const duration = payload.exp - payload.iat
		expect(duration).toBeGreaterThan(1.0)
	})

	function checkAddSessionToken(expectSecure: boolean) {
		let headers = new Headers()

		const username = 'refresher'
		const token = tokens.newSessionToken(username)
		tokens.addSessionToken(headers, token)

		let numHeaders = 0
		let numSessionCookies = 0
		let isSecure = false
		headers.forEach((value, key) => {
			numHeaders += 1
			if (key.toLowerCase() == 'set-cookie') {
				if (value.startsWith(tokens.sessionCookieName)) {
					numSessionCookies += 1
				}

				isSecure ||= value.toLowerCase().match(/;\s*secure\s*;/) != null
			}
		})

		expect(numHeaders).toBe(1)
		expect(numSessionCookies).toBe(1)
		expect(isSecure).toBe(expectSecure)
	}

	test('addSessionToken adds token to headers - insecure', () => {
		// Default config is insecure:
		checkAddSessionToken(false)
	})

	test('addSessionToken adds token to headers - secure', () => {
		tokens.configure(defaultProdConfig)
		checkAddSessionToken(true)
	})

	test('sessionUsernameFromToken handles undefined token', () => {
		expect(tokens.sessionUsernameFromToken(undefined)).toBeNull()
	})

	test('sessionUsernameFromToken handles invalid token', () => {
		expect(tokens.sessionUsernameFromToken('garbage')).toBeNull()
	})

	test('sessionUsernameFromToken handles valid token', () => {
		const username = 'Bob'
		const token = tokens.newSessionToken(username)
		expect(tokens.sessionUsernameFromToken(token)).toBe(username)
	})

	function checkAddSessionTokenForUsername(expectSecure: boolean) {
		let headers = new Headers()
		const username = 'Some user'

		tokens.addSessionTokenForUsername(headers, username)

		let numHeaders = 0
		let numSessionCookies = 0
		let isSecure = false
		let hasValidSessionToken = false
		headers.forEach((value, key) => {
			numHeaders += 1
			if (key.toLowerCase() == 'set-cookie') {
				if (value.startsWith(tokens.sessionCookieName)) {
					numSessionCookies += 1

					const m = value.match(/=([^;]+)/)
					if (m) {
						const token = m.at(1)
						if (token) {
							// There should be exactly one match across all headers.
							hasValidSessionToken = tokens.verifySessionToken(token) != null
						}
					}
				}

				isSecure ||= value.toLowerCase().match(/;\s*secure\s*;/) != null
			}
		})

		expect(numHeaders).toBe(1)
		expect(numSessionCookies).toBe(1)
		expect(isSecure).toBe(expectSecure)
		expect(hasValidSessionToken).toBe(true)
	}

	test('addSessionTokenForUsername adds token to cookies - insecure', () => {
		// Default config is insecure:
		checkAddSessionTokenForUsername(false)
	})

	test('addSessionTokenForUsername adds token to cookies - secure', () => {
		tokens.configure(defaultProdConfig)
		checkAddSessionTokenForUsername(true)
	})

	test('invalidTokenResponse clears session token', () => {
		const response = tokens.invalidTokenResponse()
		let foundClearedCookie = false
		response.headers.forEach((value, key) => {
			if (key.toLowerCase() == 'set-cookie') {
				foundClearedCookie ||= value.startsWith(`${tokens.sessionCookieName}=;`)
			}
		})
		expect(foundClearedCookie).toBe(true)
	})
})
