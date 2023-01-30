const vesuvius = {
	50: '#fffbeb',
	100: '#fef3c7',
	200: '#fde58a',
	300: '#fbd24e',
	400: '#fabe25',
	500: '#f49d0c',
	600: '#d87607',
	700: '#bc560a',
	800: '#923f0e',
	900: '#78340f'
};

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				vesuvius
			}
		}
	},
	plugins: []
};
