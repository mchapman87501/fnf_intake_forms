import type { RequestEvent } from "@sveltejs/kit";

export const prerender = true;

export function GET(event: RequestEvent): Response {
    // TODO pretend to check whether the requester has a valid
    // access token.
    return new Response("OK")
}