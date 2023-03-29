// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	declare namespace App {
		// interface Locals {}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
	export type SerialErrors = "Write" | "Read" | "Boot";

	export interface SerialError { error_type: SerialErrors, message: string, }

	export interface SerialPort { port_name: string, port_info: string, }
	export type SLConfig = {
		[key: string]: any
	}
}

export { };
