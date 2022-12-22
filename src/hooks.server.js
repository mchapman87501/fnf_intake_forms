// Hooks to run at app startup.
import { initUserDB } from "$lib/auth/user_db.server";

// Verify that all required envs are defined
import { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_ACCESS_TOKEN_SECRET, JWT_ACCESS_TOKEN_DURATION, USER_DB_PATH } from '$env/static/private'


if (!(ADMIN_USERNAME && ADMIN_PASSWORD && JWT_ACCESS_TOKEN_SECRET && JWT_ACCESS_TOKEN_DURATION && USER_DB_PATH)) {
    const msg = `
------------------------------------------------------------------------
Some required environment variables are not defined.

See env_template.in for the environment variables that need to be
defined in, e.g., your .env file.
------------------------------------------------------------------------
    `
    console.error()
    throw new Error(msg)
}

await initUserDB()

