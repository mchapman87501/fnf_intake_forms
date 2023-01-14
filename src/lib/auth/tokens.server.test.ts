import { beforeEach, describe, expect, test } from 'vitest'

import * as tokens from '$lib/auth/tokens.server'

describe('Test token basics', async () => {
	const defaultConfig: tokens.TokensServerConfig = {
		isDevEnv: true,
		accessSecret: '856d5b36c247841d6e9c8dc6acc07ab736a515162f3b7264f1bb9c376e0f049f',
		accessMinutes: 1,
		refreshSecret: '44e98b421c870062beb7e51db020ddbf12fe8c4e3e39b62931285bfd23d3f77f',
		refreshMinutes: 1,
		usernameForRefreshToken: function (token: string): string {
			return 'default user for token ' + token
		}
	}

	const defaultProdConfig = { ...defaultConfig, ...{ isDevEnv: false } }

	beforeEach(() => {
		tokens.configure(defaultConfig)
	})

	test('Create a new access token', () => {
		const username = 'Access Token User'
		const accessToken = tokens.newAccessToken(username)
		expect(accessToken).not.toBeNull()
		const payload = tokens.verifyAccessToken(accessToken)
		expect(payload).not.toBeNull()
		expect(payload.username).toBe(username)
	})

	test('Create a new refresh token', () => {
		const username = 'Refresh token username'
		const refreshToken = tokens.newRefreshToken(username)
		expect(refreshToken).not.toBeNull()
		const payload = tokens.verifyRefreshToken(refreshToken)
		expect(payload).not.toBeNull()
		expect(payload.username).toBe(username)
	})

	test('Weakly check the use of secrets', () => {
		const username = 'seekrit you sr'
		const accessToken = tokens.newAccessToken(username)
		const refreshToken = tokens.newRefreshToken(username)

		expect(tokens.verifyAccessToken(accessToken)).not.toBeNull()
		expect(tokens.verifyRefreshToken(accessToken)).toBeNull()
		expect(tokens.verifyAccessToken(refreshToken)).toBeNull()
		expect(tokens.verifyRefreshToken(refreshToken)).not.toBeNull()
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
		const token = tokens.newAccessToken(username)

		// Duration should have units of seconds.
		const payload = tokens.verifyAccessToken(token)
		const duration = payload.exp - payload.iat
		expect(duration).toBe(60)
	})

	function checkAddRefreshToken(expectSecure: boolean) {
		let headers = new Headers()

		const username = 'refresher'
		const accessToken = tokens.newAccessToken(username)
		tokens.addRefreshToken(headers, accessToken)

		let numHeaders = 0
		let numRefreshCookies = 0
		let isSecure = false
		headers.forEach((value, key) => {
			numHeaders += 1
			if (key.toLowerCase() == 'set-cookie') {
				if (value.startsWith('refresh_token')) {
					numRefreshCookies += 1
				}

				isSecure ||= value.toLowerCase().match(/;\s*secure\s*;/) != null
			}
		})

		expect(numHeaders).toBe(1)
		expect(numRefreshCookies).toBe(1)
		expect(isSecure).toBe(expectSecure)
	}

	test('addRefreshToken adds token to headers - insecure', () => {
		// Default config is insecure:
		checkAddRefreshToken(false)
	})

	test('addRefreshToken adds token to headers - secure', () => {
		tokens.configure(defaultProdConfig)
		checkAddRefreshToken(true)
	})

	test('invalidTokenResponse clears refresh token', () => {
		const response = tokens.invalidTokenResponse()
		let foundClearedRefreshCookie = false
		response.headers.forEach((value, key) => {
			if (key.toLowerCase() == 'set-cookie') {
				foundClearedRefreshCookie ||= value.startsWith('refresh_token=;')
			}
		})
		expect(foundClearedRefreshCookie).toBe(true)
	})

	test('validAccessToken recognizes unexpired access token', () => {
		const username = 'vat user'
		const token = tokens.newAccessToken(username)

		let headers = new Headers()
		tokens.addAccessToken(headers, token)
		const request = new Request('http://some.domain.com/url/', { headers: headers })
		expect(tokens.validAccessToken(request)).toBe(true)
	})

	test('validAccessToken recognizes expired token', async () => {
		const username = 'expired access token user'
		const accessMinutes = 1.0 / 60.0
		const expiringConfig = {
			...defaultConfig,
			...{
				accessMinutes: accessMinutes,
				usernameForRefreshToken: () => username
			}
		}
		tokens.configure(expiringConfig)

		const token = tokens.newAccessToken(username)
		// Wait for token to expire
		await new Promise((resolve, _) => {
			setTimeout(() => {
				resolve('Timeout elapsed')
			}, accessMinutes * 60.0 * 1000.0)
		})

		let headers = new Headers()
		tokens.addAccessToken(headers, token)
		const request = new Request('http://some.domain.com/url/', { headers: headers })
		expect(tokens.validAccessToken(request)).toBe(false)
	})

	test('renewedAccessToken reuses still-valid access token', () => {
		const username = 'reuser'
		const origAccessToken = tokens.newAccessToken(username)
		let headers = new Headers()
		tokens.addAccessToken(headers, origAccessToken)
		const request = new Request('http://some.domain.com/some/url', { headers: headers })

		const renewed = tokens.renewedAccessToken(request)
		expect(renewed).toBe(origAccessToken)
	})

	test('renewedAccessToken replaces expired access token', async () => {
		// JWT minimum resolvable duration appears to be 1 second.
		const accessMinutes = 1.0 / 60.0
		const username = 'expirer'
		const expiringConfig = {
			...defaultConfig,
			...{
				accessMinutes: accessMinutes,
				usernameForRefreshToken: () => username
			}
		}
		tokens.configure(expiringConfig)

		const origAccessToken = tokens.newAccessToken(username)
		const refreshToken = tokens.newRefreshToken(username)

		let headers = new Headers()
		tokens.addAccessToken(headers, origAccessToken)
		// Simulate a client-side refresh token.
		headers.append('cookie', `refresh_token=${refreshToken}`)
		const request = new Request('http://some.domain.com/some/url', { headers: headers })

		// Wait for the access token to expire.
		const expireProm = new Promise((resolve, _) => {
			setTimeout(() => {
				resolve('Timeout elapsed')
			}, accessMinutes * 60.0 * 1000.0)
		})
		await expireProm

		const renewed = tokens.renewedAccessToken(request)
		expect(renewed).not.toBe(origAccessToken)
		expect(renewed).not.toBe('')
	})

	// TODO test addAccessToken, extractedAccessToken, extractedRefreshToken, validAccessToken.
})
