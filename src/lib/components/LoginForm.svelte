<script lang="ts">
	import { goto } from '$app/navigation'
	import { session_token, session_username } from '$lib/hooks/auth'
	// I'm not using sapper, but this may be relevant:
	// https://stackoverflow.com/a/60426501

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
			const token = await rqst.json()
			session_username.update((curr) => username)
			session_token.update((curr) => token)
			// Use goto to preserve the store content.
			// TODO redirect to whatever page sent us here.
			goto('/')
		}
	}
</script>

<h1>Login</h1>

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
	.error {
		color: red;
	}
</style>
