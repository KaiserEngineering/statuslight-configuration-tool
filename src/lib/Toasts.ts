import { toast } from '@zerodevx/svelte-toast';

export const success = (m) =>
	toast.push(m, {
		theme: {
			'--toastBackground': 'green',
			'--toastColor': 'white',
			'--toastBarBackground': 'olive'
		},
		duration: 2000,
		pausable: true
	});

export const info = (m: string) =>
	toast.push(m, {
		classes: ['bg-nord10'],
		pausable: true,
		duration: 2000
	});

export const error = (m: string) =>
	toast.push(m, {
		theme: {
			'--toastBackground': '#F56565',
			'--toastBarBackground': '#C53030'
		},
		pausable: true,
		duration: 2000
	});
