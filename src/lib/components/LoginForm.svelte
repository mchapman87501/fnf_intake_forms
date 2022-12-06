<script lang="ts">
	// For help navigating back to the page that sent the
	// browser to the current (login) page.
	// https://stackoverflow.com/a/71585077
	import { goto, afterNavigate } from '$app/navigation'
	import { base } from '$app/paths'

	import { session_token, session_username } from '$lib/hooks/auth'

	let prevPage: string = base
	afterNavigate(({ from }) => {
		prevPage = from?.url.pathname || prevPage
	})

	export let why: string | null = null

	let username = ''
	let password = ''
	let error = ''

	async function login() {
		const params: { [index: string]: string } = {
			username: username,
			password: password // Ooo look how secure.
		}
		let bodyItems = []
		for (let property in params) {
			const key = encodeURIComponent(property)
			const value = encodeURIComponent(params[property])
			bodyItems.push(`${key}=${value}`)
		}
		const body = bodyItems.join('&')
		let rqst = await fetch('/api/v1/yalnets', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: body
		})
		if (!rqst.ok) {
			error = rqst.statusText
		} else {
			const tokenObj = await rqst.json()
			const accessToken: string = tokenObj['access_token']
			session_username.update((curr) => username)
			session_token.update((curr) => accessToken)

			// Back to whence we came:
			goto(prevPage)
		}
	}
</script>

<h1>Login</h1>

{#if why != null}
	<p class="why_here">{why}</p>
{/if}

<form on:submit|preventDefault={login}>
	{#if error != ''}
		<p class="error">
			{error}
		</p>
	{/if}
	<label>
		Username:
		<input type="text" name="username" placeholder="Username" bind:value={username} />
	</label>
	<label>
		Password:
		<input type="password" name="password" placeholder="Password" bind:value={password} />
	</label>
	<button type="submit">Login</button>
</form>

<style>
	.why_here {
		font-style: italic;
	}
	.error {
		color: red;
	}
</style>
