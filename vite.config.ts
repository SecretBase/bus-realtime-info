import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

console.log(process.env.NODE_ENV);

const config: UserConfig = {
	plugins: [sveltekit()],
	define: {
		'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
	}
};

export default config;
