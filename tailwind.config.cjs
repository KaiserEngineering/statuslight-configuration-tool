module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				nord0: '#2E3440',
				nord1: '#3B4252',
				nord2: '#434C5E',
				nord3: '#4C566A',
				nord4: '#D8DEE9',
				nord5: '#E5E9F0',
				nord6: '#ECEFF4',
				nord7: '#8FBCBB',
				nord8: '#88C0D0',
				nord9: '#81A1C1',
				nord10: '#5E81AC',
				nord11: '#BF616A',
				nord12: '#D08770',
				nord13: '#EBCB8B',
				nord14: '#A3BE8C',
				nord15: '#B48EAD',
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
