import { writable } from 'svelte/store';
import { ShiftLight } from './Shiftlight';

// TODO: Add type for shiftlight object
export const shiftlight = writable(new ShiftLight());
