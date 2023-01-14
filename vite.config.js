import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
        coverage: {
            provider: "istanbul",
            reporter: "html"
        }
        // This workaround is needed for tests that check, even indirectly,
        // for Vite's import.meta.env.SSR.
        // My understanding is that the problem is resolved as of
        // @sveltejs/kit@1.0.0-next.580.
        // See https://github.com/vitest-dev/vitest/issues/2298
        , deps: { inline: ["@sveltejs/kit"]}
	}
};

export default config;
