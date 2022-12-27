import { toast } from '@zerodevx/svelte-toast';

export const success = (m) =>
	toast.push(m, {
		theme: {
			'--toastBackground': 'green',
			'--toastColor': 'white',
			'--toastBarBackground': 'olive'
		},
		pausable: true
	});

export const info = (m) =>
	toast.push(m, {
		classes: ['bg-nord10'],
		pausable: true
	});

export const error = (m) =>
	toast.push(m, {
		theme: {
			'--toastBackground': '#F56565',
			'--toastBarBackground': '#C53030'
		},
		pausable: true
	});
