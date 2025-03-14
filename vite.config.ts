import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(),],
	envPrefix: 'PUBLIC_',
	resolve: {
		dedupe: ['@fullcalendar/common'],
	},
	optimizeDeps: {
		include: ['@fullcalendar/common'],
	},
});


// export default defineConfig({
// 	plugins: [sveltekit()]
// });
