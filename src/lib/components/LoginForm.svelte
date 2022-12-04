<script lang="ts">
	import { session_token, session_username } from '$lib/hooks/auth'

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
			session_username.set(username)
			session_token.set(await rqst.json())
			// TODO redirect to whatever page sent us here.
			window.location.href = '/'
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
