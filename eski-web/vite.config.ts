import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Buffer } from 'buffer';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		"Buffer": Buffer
	},
});
