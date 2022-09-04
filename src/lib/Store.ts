import { writable } from 'svelte/store';
import { ShiftLight } from './Shiftlight';

export const shiftlight = writable(new ShiftLight());

export const form_content = writable({})

export const session = writable({
  loading: false,
});
