// import type { Actions } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'

// To fix 405 error:
// https://stackoverflow.com/a/73755196
// +page.server.ts should export const actions.
// +server.ts (like this file) should still use
// function POST.

export function POST(event: RequestEvent): Response {
    console.log("Processing form data: %o", event)
    // TODO accept form data and return a valid JWT.
    const accessToken = "BOGUSB64=="
    const result = { "access_token": accessToken, "token_type": "bearer" }
    return new Response(JSON.stringify(result))
}

// export const actions: Actions = {
//     default: async (event) => {
//         console.log("Processing form data: %o", event)
//         // TODO accept form data and return a valid JWT.
//         const accessToken = "BOGUSB64=="
//         const result = { "access_token": accessToken, "token_type": "bearer" }
//         return new Response(JSON.stringify(result))
//     }
// }