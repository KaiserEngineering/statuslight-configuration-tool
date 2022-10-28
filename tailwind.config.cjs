module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				red: {
					50: '#ff7f7f',
					100: '#ff7575',
					200: '#ff6b6b',
					300: '#ff6161',
					400: '#ff5757',
					500: '#ff4d4d',
					600: '#f54343',
					700: '#eb3939',
					800: '#e12f2f',
					900: '#d72525'
				},
				gray: {
					900: '#202225',
					800: '#2f3136',
					700: '#36393f',
					600: '#4f545c',
					400: '#d4d7dc',
					300: '#e3e5e8',
					200: '#ebedef',
					100: '#f2f3f5'
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
