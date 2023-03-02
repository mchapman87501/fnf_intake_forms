<script context="module" lang="ts">
	import { get, writable } from 'svelte/store'
	import { session_username } from '$lib/auth'
	import { catPkg, recvdFromPkg } from '$lib/infrastructure/stores'

	import { showLogin } from '$lib/components/LoginDialog.svelte'
	import { downloadCompletedForm } from '$lib/api_support/download_info'
	import type { SurrenderDownloads } from '$lib/api_support/surrender_and_intake_info'

	let downloading = writable(false)
	let downloadBtn: HTMLInputElement

	downloading.subscribe((is_downloading) => {
		if (downloadBtn !== undefined) {
			downloadBtn.disabled = is_downloading
		}
	})

	export async function handleSubmit(fetchEndpoint: string) {
		const username = get(session_username) || ''
		if (username == '') {
			showLogin('You must be logged in to submit a form.')
			return
		}

		downloading.set(true)

		const bodyData = {
			catInfo: get(catPkg),
			receivedFrom: get(recvdFromPkg)
		}
		const bodyJSON = JSON.stringify(bodyData)
		const response = await fetch(fetchEndpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: bodyJSON
		})

		downloading.set(false)

		if (response.status == 401) {
			// Unauthorized, or session has expired. -- need to redirect to login.
			showLogin('Your session has expired.')
		} else if (response.status == 200) {
			const info = (await response.json()) as SurrenderDownloads
			await downloadCompletedForm(info.surrender)
			await downloadCompletedForm(info.intake)
			await downloadCompletedForm(info.intakeSingleRow)
			if (info.surrenderPDF !== undefined) {
				await downloadCompletedForm(info.surrenderPDF)
			}
		}
	}
</script>

<div>
	<input
		type="submit"
		bind:this={downloadBtn}
		title="Save this form and download the resulting intake forms."
		value="Download Forms"
	/>

	{#if $downloading}
		<span>Generating forms &mdash; this may take several seconds.</span>
	{/if}
</div>

<style>
	span {
		font-size: 75%;
	}
	div {
		margin-top: 1em;
		margin-left: 0.25em;
	}
</style>
