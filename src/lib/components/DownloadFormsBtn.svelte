<script context="module" lang="ts">
	import { get, writable } from 'svelte/store'
	import { session_username } from '$lib/auth'
	import { catPkg, recvdFromPkg } from '$lib/infrastructure/stores'

	import { showLogin } from '$lib/components/LoginDialog.svelte'
	import { downloadCompletedForm } from '$lib/api_support/download_info'
	import type { SurrenderDownloads } from '$lib/api_support/surrender_and_intake_info'

	let downloading = writable(false)
	let errorMsg = writable('')
	let downloadBtn: HTMLInputElement

	downloading.subscribe((is_downloading) => {
		if (downloadBtn !== undefined) {
			downloadBtn.disabled = is_downloading
		}
	})

	async function processFormSubmitResult(response: Response) {
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

	export async function handleSubmit(fetchEndpoint: string) {
		const username = get(session_username) || ''
		if (username == '') {
			showLogin('You must be logged in to submit a form.')
			return
		}

		downloading.set(true)
		errorMsg.set('')

		const bodyData = {
			catInfo: get(catPkg),
			receivedFrom: get(recvdFromPkg)
		}
		const bodyJSON = JSON.stringify(bodyData)

		// For timeout handling approach see
		// https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout
		const submitTimeoutMSec = 10000
		try {
			const response = await fetch(fetchEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: bodyJSON,
				signal: AbortSignal.timeout(submitTimeoutMSec)
			})
			await processFormSubmitResult(response)
		} catch (e: any) {
			if (e.name === 'TimeoutError') {
				errorMsg.set("The server isn't responding quickly enough.  Please try again.")
			} else if (e.name === 'AbortError') {
				// It looks like this can have causes other than user action -- for example,
				// submitTimeoutMSec is so short that it fires before the fetch gets
				// underway.
				errorMsg.set('Reason unknown.')
			} else if (e.name == 'TypeError') {
				errorMsg.set('Oops.  form submission timeout is not supported.')
			} else {
				// In case of other errors, just try to show what went wrong?
				let message = e.message
				if (!message) {
					message = e.toString()
					if (!message) {
						message = `Unknown error: ${e}`
					}
				}
				errorMsg.set(message)
			}
		}

		downloading.set(false)
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
	{#if $errorMsg !== ''}
		<span class="error">Could not download forms: {$errorMsg}</span>
	{/if}
</div>

<style>
	span {
		font-size: 75%;
	}

	span.error {
		color: red;
	}

	div {
		margin-top: 1em;
		margin-left: 0.25em;
	}
</style>
