// Hooks to run at app startup.

import { initUserDB } from "$lib/auth/user_db.server";

await initUserDB()