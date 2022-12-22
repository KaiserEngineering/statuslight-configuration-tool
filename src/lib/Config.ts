import type { SLConfig } from "../app";

export const ShiftLightConfigs: SLConfig = {
	All: {
		'Daytime Illumination': {
			code: 'ILLUMDAY',
			type: 'number',
			min: 0,
			max: 255,
			fieldType: 'Display',
			info: 'Configure the Shift Light brightness when light out',
		},
		'Nighttime Illumination': {
			code: 'ILLUMNIGHT',
			type: 'number',
			min: 0,
			max: 255,
			fieldType: 'Display',
			info: 'Configure the Shift Light brightness when dark out',
		},
		'Illumination Mode': {
			code: 'ILLUMMODE',
			type: [
				{ label: 'Daytime', value: '0' },
				{ label: 'Nighttime', value: '1' }
			],
			fieldType: 'Display',
			info: 'Configure the Shift Light illumination mode',
		},
		'USB Echo': {
			code: 'ECHO',
			type: 'checkbox',
			min: 0,
			max: 1,
			fieldType: 'Advanced',
			info: 'Configure the USB to echo back the received data',
		},
		'Animation Mode': {
			code: 'ANIM',
			type: [
				{ label: 'Left To Right', value: '0' },
				{ label: 'Right To Left', value: '1' },
				{ label: 'Out To In', value: '2' },
				{ label: 'In To Out', value: '3' }
			],
			info: 'Configure the LED animation',
			fieldType: 'Basics',
		},
		'Acquisition Mode': {
			code: 'ACQ',
			type: [
				{ label: 'OBDII', value: '0' },
				{ label: 'Sniff', value: '1' },
				{ label: 'Tach', value: '2' }
			],
			fieldType: 'Advanced',
			info: 'Configure the acquisition mode, for example OBDII or tachometer',
		},
		'Power Saver': {
			code: 'POWER',
			type: [
				{ label: 'Disabled', value: '0' },
				{ label: 'Enabled', value: '1' }
			],
			fieldType: 'Power',
			info: 'Configure if the Shift Light will go into sleep mode when the vehicle is powered off',
		},
		'Battery Voltage': {
			code: 'BATTERY',
			type: [
				{ label: '12V0', value: '0' },
				{ label: '12V5', value: '1' },
				{ label: '13V0', value: '2' },
				{ label: '13V5', value: '3' }
			],
			fieldType: 'Power',
			info: 'Configure the voltage threshold to trigger the Shift Light to wake-up',
		},
		'CAN Bus Baud Rate': {
			code: 'CANBAUD',
			type: [
				{ label: '500KB', value: '0' },
				{ label: '250KB', value: '1' }
			],
			fieldType: 'CAN',
			info: 'Configure the baud rate of the Shift Light',
		},
		'CAN Bus Identifier Lengh': {
			code: 'CANIDE',
			type: [
				{ label: '11Bit', value: '0' },
				{ label: '29Bit', value: '1' }
			],
			fieldType: 'CAN',
			info: 'Configure the CAN bus identifier length for either 11-bit or 29-bit',
		},
		'CAN Bus Sniff ID': {
			code: 'SNIFF',
			type: 'number',
			min: 0,
			max: 65535,
			fieldType: 'CAN',
			info: 'Configure the CAN bus ID where RPM data is located',
		}
	},
	RPM: {
		'Shift Point': {
			code: 'SHIFT',
			type: 'number',
			min: 500,
			max: 16000,
			fieldType: 'Basics',
			info: 'Configure when the Shift Light will indicate shift point',
		},
		'Activation Point': {
			code: 'ACT',
			type: 'number',
			min: 0,
			max: 15500,
			fieldType: 'Basics',
			info: 'Configure when the Shift Light will turn on',
		},
		'Color Palette': {
			code: 'COLOR',
			type: [
				{ label: 'Blue Green Red', value: '0' },
				{ label: 'Green Red Blue', value: '1' },
				{ label: 'Green Red', value: '2' },
				{ label: 'Aura', value: '3' }
			],
			info: 'Configure the LED color palette',
			fieldType: 'Basics',
		},
		'Real-time RPM Value': {
			code: 'RPM',
			type: 'number',
			min: 500,
			max: 16000,
			fieldType: 'Advanced',
			info: 'Set the current RPM value. This is typically used for simulating vehicle data.',
		},
		'Peak Hold': {
			code: 'PEAK',
			type: [
				{ label: 'Disabled', value: '0' },
				{ label: 'Enabled', value: '1' }
			],
			fieldType: 'Basics',
			info: 'Configure the Shift Light to display to peak RPM value and decay after a given delay',
		},
		'Shift Color': {
			code: 'SHIFTCOLOR',
			type: [
				{ label: 'Off', value: '0' },
				{ label: 'Blue', value: '1' },
				{ label: 'Green', value: '2' },
				{ label: 'Teal', value: '3' },
				{ label: 'Red', value: '4' },
				{ label: 'Purple', value: '5' },
				{ label: 'Yellow', value: '6' },
				{ label: 'White', value: '7' },
			],
			fieldType: 'Basics',
			info: 'Configure the color the Shift Light will illuminate when it is time to shift',
		},
		'Flash On Shift': {
			code: 'FLASH',
			type: [
				{ label: 'Disabled', value: '0' },
				{ label: 'Enabled', value: '1' }
			],
			fieldType: 'Basics',
			info: 'Configure if the Shift Light will flash or illuminate a solid color when it is time to shift',
		}
	},
	Boost: {
		'Real-time Boost Value': {
			code: 'BOOST',
			type: 'number',
			min: -11,
			max: 24,
			fieldType: 'Basics',
			info: 'Set the current Boost value. This is typically used for simulating vehicle data.',
		},
		'Acquistion Mode': {
			code: 'ACQ',
			type: [
				{ label: 'OBDII', value: '0' },
				{ label: 'Sniff', value: '1' },
				{ label: 'Tach', value: '2' }
			],
			fieldType: 'Basics',
			info: 'Configure the acquisition mode, for example OBDII or tachometer',
		}
	}
}
