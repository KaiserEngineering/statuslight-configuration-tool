import { z } from 'zod';
import type { Infer } from 'sveltekit-superforms';

import { type CommandSchema } from '$schemas/config';

export const ECHO: Infer<CommandSchema> = {
	cmd: 'ECHO',
	name: 'USB Echo',
	desc: 'Configure the USB to echo back the received data',
	type: 'number',
	dataType: 'uint8_t',
	default: 0,
	min: 0,
	max: 1,
	EEBytes: 0,
	appConfig: 'No',
	fieldType: 'USB',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const VER: Infer<CommandSchema> = {
	cmd: 'VER',
	name: 'Firmware Version',
	desc: 'Return the current version of the Status Light firmware',
	type: 'number',
	dataType: 'uint16_t',
	default: 0,
	min: 0,
	max: 0,
	EEBytes: 2,
	appConfig: 'No',
	fieldType: 'Device Info',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Only',
	write_func: '',
	read_func: 'respLen = snprintf(resp, sizeof(resp), "%s", STATUSLIGHT_FW_VERSION)'
};

export const EEVER: Infer<CommandSchema> = {
	cmd: 'EEVER',
	name: 'EEPROM Version',
	desc: 'Read the current version of the EEPROM',
	type: 'number',
	dataType: 'uint16_t',
	default: 0,
	min: 0,
	max: 0,
	EEBytes: 2,
	appConfig: 'No',
	fieldType: 'Device Info',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Only',
	write_func: '',
	read_func: ''
};

export const POWER: Infer<CommandSchema> = {
	cmd: 'POWER',
	name: 'Power Saver',
	desc: 'Configure if the Status Light will go into sleep mode when the vehicle is powered off',
	type: 'list',
	dataType: 'POWER_BOOLEAN',
	default: 'Enabled',
	options: ['Disabled', 'Enabled'],
	limit: 'Reserved',
	EEBytes: 1,
	appConfig: 'No',
	fieldType: 'Power',
	UserConfig: 'No',
	AdvConfig: 'Yes',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const CANBAUD: Infer<CommandSchema> = {
	cmd: 'CANBAUD',
	name: 'CAN Bus Baud Rate',
	desc: 'Configure the baud rate of the Status Light',
	type: 'list',
	dataType: 'CAN_BAUD_RATE',
	default: '500 kbit/s',
	options: ['125 kbit/s', '250 kbit/s', '500 kbit/s'],
	limit: 'Reserved',
	EEBytes: 1,
	appConfig: 'Yes',
	fieldType: 'General CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'Yes',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const CANIDE: Infer<CommandSchema> = {
	cmd: 'CANIDE',
	name: 'CAN Bus Identifier Length',
	desc: 'Configure the CAN bus identifier length for either 11-bit or 29-bit',
	type: 'list',
	dataType: 'CAN_IDE',
	default: '11-Bit',
	options: ['11-Bit', '29-Bit'],
	limit: 'Reserved',
	EEBytes: 1,
	appConfig: 'Yes',
	fieldType: 'General CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'Yes',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const LEDID01: Infer<CommandSchema> = {
	cmd: 'LEDID01',
	name: 'LED0-LED1 CAN ID',
	desc: 'CAN ID for the LED0-LED1 RGB Register expressed in hexadecimal',
	type: 'number',
	dataType: 'uint32_t',
	default: 419418202,
	min: 0,
	max: 536870911,
	EEBytes: 4,
	appConfig: 'Yes',
	fieldType: 'CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const LEDID23: Infer<CommandSchema> = {
	cmd: 'LEDID23',
	name: 'LED2-LED3 CAN ID',
	desc: 'CAN ID for the LED2-LED3 RGB Register expressed in hexadecimal',
	type: 'number',
	dataType: 'uint32_t',
	default: 419418458,
	min: 0,
	max: 536870911,
	EEBytes: 4,
	appConfig: 'Yes',
	fieldType: 'CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const LEDID45: Infer<CommandSchema> = {
	cmd: 'LEDID45',
	name: 'LED4-LED5 CAN ID',
	desc: 'CAN ID for the LED4-LED5 RGB Register expressed in hexadecimal',
	type: 'number',
	dataType: 'uint32_t',
	default: 419418714,
	min: 0,
	max: 536870911,
	EEBytes: 4,
	appConfig: 'Yes',
	fieldType: 'CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const LEDID67: Infer<CommandSchema> = {
	cmd: 'LEDID67',
	name: 'LED6-LED7 CAN ID',
	desc: 'CAN ID for the LED6-LED7 RGB Register expressed in hexadecimal',
	type: 'number',
	dataType: 'uint32_t',
	default: 419418970,
	min: 0,
	max: 536870911,
	EEBytes: 4,
	appConfig: 'Yes',
	fieldType: 'CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const LEDID89: Infer<CommandSchema> = {
	cmd: 'LEDID89',
	name: 'LED8-LED9 CAN ID',
	desc: 'CAN ID for the LED8-LED9 RGB Register expressed in hexadecimal',
	type: 'number',
	dataType: 'uint32_t',
	default: 419419226,
	min: 0,
	max: 536870911,
	EEBytes: 4,
	appConfig: 'Yes',
	fieldType: 'CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const LEDID1011: Infer<CommandSchema> = {
	cmd: 'LEDID1011',
	name: 'LED10-LED11 CAN ID',
	desc: 'CAN ID for the LED10-LED11 RGB Register expressed in hexadecimal',
	type: 'number',
	dataType: 'uint32_t',
	default: 419419482,
	min: 0,
	max: 536870911,
	EEBytes: 4,
	appConfig: 'Yes',
	fieldType: 'CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const LEDID1213: Infer<CommandSchema> = {
	cmd: 'LEDID1213',
	name: 'LED12-LED13 CAN ID',
	desc: 'CAN ID for the LED12-LED13 RGB Register expressed in hexadecimal',
	type: 'number',
	dataType: 'uint32_t',
	default: 419419738,
	min: 0,
	max: 536870911,
	EEBytes: 4,
	appConfig: 'Yes',
	fieldType: 'CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const LEDID1415: Infer<CommandSchema> = {
	cmd: 'LEDID1415',
	name: 'LED14-LED15 CAN ID',
	desc: 'CAN ID for the LED14-LED15 RGB Register expressed in hexadecimal',
	type: 'number',
	dataType: 'uint32_t',
	default: 419419994,
	min: 0,
	max: 536870911,
	EEBytes: 4,
	appConfig: 'Yes',
	fieldType: 'CAN Bus',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read-Write',
	write_func: '',
	read_func: ''
};

export const RESET: Infer<CommandSchema> = {
	cmd: 'RESET',
	name: 'Reset',
	desc: 'Reset the Status Light, this does NOT erase saved data',
	type: 'number',
	dataType: 'uint8_t',
	default: 0,
	min: 0,
	max: 1,
	EEBytes: 0,
	appConfig: 'No',
	fieldType: 'Command',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read',
	write_func: '',
	read_func: 'Reset()'
};

export const DEFAULT: Infer<CommandSchema> = {
	cmd: 'DEFAULT',
	name: 'Default',
	desc: 'Set the Status Light settings back to defaults',
	type: 'number',
	dataType: 'uint8_t',
	default: 0,
	min: 0,
	max: 1,
	EEBytes: 0,
	appConfig: 'No',
	fieldType: 'Command',
	UserConfig: 'No',
	AdvConfig: 'No',
	ParamType: 'Status',
	readWrite: 'Read',
	write_func: '',
	read_func: 'set_default_settings()'
};

export const AllCommands = [
	ECHO,
	VER,
	EEVER,
	POWER,
	CANBAUD,
	CANIDE,
	LEDID01,
	LEDID23,
	LEDID45,
	LEDID67,
	LEDID89,
	LEDID1011,
	LEDID1213,
	LEDID1415,
	RESET,
	DEFAULT
];

const config = {};
AllCommands.forEach((command) => {
	if (command.appConfig === 'Yes' && command.readWrite === 'Read-Write') {
		if (command.type === 'list') {
			config[command.cmd] = z.coerce.number();
		} else {
			config[command.cmd] = z
				.string()
				.min(command.min)
				.max(command.max)
				.regex(new RegExp(`^[A-Fa-f0-9]+$`));
		}
	}
});

export const sessionConfig = config;

export type SessionConfig = typeof sessionConfig;
