<script lang="ts">
	// This follows
	// https://dev.to/myleftshoe/svelte-dialogs-the-easy-way-e0f
	import { session_username } from '$lib/auth'
	import { why } from './login_reason'

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
			error = 'Could not authenticate.'
		} else {
			session_username.set(username)
			close()
		}
	}
</script>

<div class="header">
	<img src="/fnf_logo_gray.jpg" alt="Felines & Friends Logo" />
	<div>Sign In</div>
</div>

<p class="why_here">{$why}</p>

<form on:submit|preventDefault={login}>
	{#if error != ''}
		<p class="error">
			{error}
		</p>
	{/if}
	<!-- svelte-ignore a11y-autofocus -->
	<input type="text" name="username" placeholder="Username" bind:value={username} autofocus />
	<br />
	<input type="password" name="password" placeholder="Password" bind:value={password} />
	<div class="button_box">
		<button type="submit">Sign in</button>
		<button type="button" on:click|preventDefault={close}>Cancel</button>
	</div>
</form>

<style>
	input {
		margin: 0.25em 1em;
	}
	.header {
		display: flex;
		align-items: center;
	}
	.header > img {
		opacity: 0.75;
		height: 5em;
		flex: 1 1 auto;
		object-fit: contain;
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
