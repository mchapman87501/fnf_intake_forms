<script lang="ts">
	// This follows
	// https://dev.to/myleftshoe/svelte-dialogs-the-easy-way-e0f

	import { session_token, session_username } from '$lib/auth/auth'

	export let loginReason = ''
	export let close: () => void = () => {}

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
		let rqst = await fetch('/api/v1/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				Accept: 'application/json'
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
			close()
		}
	}
</script>

<div class="header">
	<img src="/fnf_logo_gray.jpg" alt="Felines & Friends Logo" />
	<div>Sign In</div>
</div>

{#if loginReason != null && loginReason != ''}
	<p class="why_here">{loginReason}</p>
{/if}

<form on:submit|preventDefault={login}>
	{#if error != ''}
		<p class="error">
			{error}
		</p>
	{/if}
	<input type="text" name="username" placeholder="Username" bind:value={username} />
	<br />
	<input type="password" name="password" placeholder="Password" bind:value={password} />
	<div class="button_box">
		<button type="submit">Sign in</button>
		<button type="cancel" on:click|preventDefault={close}>Cancel</button>
	</div>
</form>

<style>
	.header {
		display: flex;
		align-items: center;
	}
	.header > img {
		opacity: 0.75;
		height: 5em;
		flex: 1 1 auto;
	}
	.header > div {
		flex: 1 1 auto;
		width: max-content;
	}
	.why_here {
		font-style: italic;
		font-size: 75%;
	}
	.error {
		color: red;
	}

	.button_box {
		margin-top: 1em;
		text-align: right;
	}
</style>
