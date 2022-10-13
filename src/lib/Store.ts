import { writable } from 'svelte/store';
import { ShiftLight } from './Shiftlight';

export const shiftlight = writable(new ShiftLight());

export const session = writable({
	loading: false
});

export const darkTheme = writable(false);
