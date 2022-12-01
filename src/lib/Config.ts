export const ShiftLightConfigs = {
	RPM: {
		'Shift Point': {
			code: 'SHIFT',
			type: 'number',
			min: 500,
			max: 16000,
			info: 'Configure when the Shift Light will indicate shift point',
		},
		'Activation Point': {
			code: 'ACT',
			type: 'number',
			min: 0,
			max: 15500,
			info: 'Configure when the Shift Light will turn on',
		},
		'Animation Mode': {
			code: 'ANIM',
			type: [
				{ label: 'LEFT_TO_RIGHT', value: '0' },
				{ label: 'RIGHT_TO_LEFT', value: '1' },
				{ label: 'OUT_TO_IN', value: '2' },
				{ label: 'IN_TO_OUT', value: '3' }
			],
			info: 'Configure the LED animation',
		},
		'Color Palette': {
			code: 'COLOR',
			type: [
				{ label: 'BLU_GRN_RED', value: '0' },
				{ label: 'GRN_RED_BLU', value: '1' },
				{ label: 'GRN_RED', value: '2' },
				{ label: 'AURA', value: '3' }
			],
			info: 'Configure the LED color palette',
		},
		'Daytime Illumination': {
			code: 'ILLUMDAY',
			type: 'number',
			min: 0,
			max: 255,
			info: 'Configure the Shift Light brightness when light out',
		},
		'Nighttime Illumination': {
			code: 'ILLUMNIGHT',
			type: 'number',
			min: 0,
			max: 255,
			info: 'Configure the Shift Light brightness when dark out',
		},
		'Illumination Mode': {
			code: 'ILLUMMODE',
			type: [
				{ label: 'DAYTIME', value: '0' },
				{ label: 'NIGHTTIME', value: '1' }
			],
			info: 'Configure the Shift Light illumination mode',
		},
		'USB Echo': {
			code: 'ECHO',
			type: 'number',
			min: 0,
			max: 1,
			info: 'Configure the USB to echo back the received data',
		},
		'Firmware Version': {
			code: 'VER',
			type: 'number',
			min: 0,
			max: 0,
			info: 'Return the current version of the Shift Light firmware',
		},
		'Acquisition Mode': {
			code: 'ACQ',
			type: [
				{ label: 'OBDII', value: '0' },
				{ label: 'SNIFF', value: '1' },
				{ label: 'TACH', value: '2' }
			],
			info: 'Configure the acquisition mode, for example OBDII or tachometer',
		},
		'Real-time RPM Value': {
			code: 'RPM',
			type: 'number',
			min: 500,
			max: 16000,
			info: 'Set the current RPM value. This is typically used for simulating vehicle data.',
		},
		'Peak Hold': {
			code: 'PEAK',
			type: [
				{ label: 'DISABLED', value: '0' },
				{ label: 'ENABLED', value: '1' }
			],
			info: 'Configure the Shift Light to display to peak RPM value and decay after a given delay',
		},
		'EEPROM Version': {
			code: 'EEVER',
			type: 'number',
			min: 0,
			max: 0,
			info: 'Read the current version of the EEPROM',
		},
		'Shift Color': {
			code: 'SHIFTCOLOR',
			type: [
				{ label: 'WHITE', value: '0' },
				{ label: 'RED', value: '1' },
				{ label: 'GREEN', value: '2' },
				{ label: 'BLUE', value: '3' },
				{ label: 'YELLOW', value: '4' },
				{ label: 'TEAL', value: '5' },
				{ label: 'PURPLE', value: '6' }
			],
			info: 'Configure the color the Shift Light will illuminate when it is time to shift',
		},
		'Flash On Shift': {
			code: 'FLASH',
			type: [
				{ label: 'DISABLED', value: '0' },
				{ label: 'ENABLED', value: '1' }
			],
			info: 'Configure if the Shift Light will flash or illuminate a solid color when it is time to shift',
		},
		'Power Saver': {
			code: 'POWER',
			type: [
				{ label: 'DISABLED', value: '0' },
				{ label: 'ENABLED', value: '1' }
			],
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
			info: 'Configure the voltage threshold to trigger the Shift Light to wake-up',
		},
		'CAN Bus Baud Rate': {
			code: 'CANBAUD',
			type: [
				{ label: '500KB', value: '0' },
				{ label: '250KB', value: '1' }
			],
			info: 'Configure the baud rate of the Shift Light',
		},
		'CAN Bus Identifier Lengh': {
			code: 'CANID',
			type: [
				{ label: '11BIT', value: '0' },
				{ label: '29BIT', value: '1' }
			],
			info: 'Configure the CAN bus identifier length for either 11-bit or 29-bit',
		},
		'CAN Bus Sniff ID': {
			code: 'SNIFF',
			type: 'number',
			min: 0,
			max: 65535,
			info: 'Configure the CAN bus ID where RPM data is located',
		},
	},
	Boost: {
		'Animation Mode': {
			code: 'ANIM',
			type: [
				{ label: 'LEFT_TO_RIGHT', value: '0' },
				{ label: 'RIGHT_TO_LEFT', value: '1' },
				{ label: 'OUT_TO_IN', value: '2' },
				{ label: 'IN_TO_OUT', value: '3' }
			],
			info: 'Configure the LED animation',
		},
		'Daytime Illumination': {
			code: 'ILLUMDAY',
			type: 'number',
			min: 0,
			max: 255,
			info: 'Configure the Shift Light brightness when light out',
		},
		'Nighttime_Illumination': {
			code: 'ILLUMNIGHT',
			type: 'number',
			min: 0,
			max: 255,
			info: 'Configure the Shift Light brightness when dark out',
		},
		'Illumination Mode': {
			code: 'ILLUMMODE',
			type: [
				{ label: 'DAYTIME', value: '0' },
				{ label: 'NIGHTTIME', value: '1' }
			],
			info: 'Configure the Shift Light illumination mode',
		},
		'USB Echo': {
			code: 'ECHO',
			type: 'number',
			min: 0,
			max: 1,
			info: 'Configure the USB to echo back the received data',
		},
		'Firmware Version': {
			code: 'VER',
			type: 'number',
			min: 0,
			max: 0,
			info: 'Return the current version of the Shift Light firmware',
		},
		'Real-time Boost Value': {
			code: 'BOOST',
			type: 'number',
			min: -11,
			max: 24,
			info: 'Set the current Boost value. This is typically used for simulating vehicle data.',
		},
		'Acquisition Mode': {
			code: 'ACQ',
			type: [
				{ label: 'OBDII', value: '0' },
				{ label: 'SNIFF', value: '1' },
				{ label: 'TACH', value: '2' }
			],
			info: 'Configure the acquisition mode, for example OBDII or tachometer',
		},
		'Configuration': {
			code: 'CONFIG',
			type: [
				{ label: 'RPM', value: '0' },
				{ label: 'BOOST', value: '1' }
			],
			info: 'Configure the Shift Light to RPM or Boost mode',
		},
		'EEPROM Version': {
			code: 'EEVER',
			type: 'number',
			min: 0,
			max: 0,
			info: 'Read the current version of the EEPROM',
		},
		'Power Saver': {
			code: 'POWER',
			type: [
				{ label: 'DISABLED', value: '0' },
				{ label: 'ENABLED', value: '1' }
			],
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
			info: 'Configure the voltage threshold to trigger the Shift Light to wake-up',
		},
		'CAN Bus Baud Rate': {
			code: 'CANBAUD',
			type: [
				{ label: '500KB', value: '0' },
				{ label: '250KB', value: '1' }
			],
			info: 'Configure the baud rate of the Shift Light',
		},
		'CAN Bus Identifier Lengh': {
			code: 'CANID',
			type: [
				{ label: '11BIT', value: '0' },
				{ label: '29BIT', value: '1' }
			],
			info: 'Configure the CAN bus identifier length for either 11-bit or 29-bit',
		},
		'CAN Bus Sniff ID': {
			code: 'SNIFF',
			type: 'number',
			min: 0,
			max: 65535,
			info: 'Configure the CAN bus ID where RPM data is located',
		},
	}
}
