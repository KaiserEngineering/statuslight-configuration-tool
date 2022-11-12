export const ShiftLightConfigs = {
	RPM: {
		'Shift Point': {
			code: 'SHIFT',
			type: 'number',
			min: 0,
			max: 16000,
			info: 'RPM value to flash shift light at.'
		},
		'Acquisition Mode': {
			code: 'ACQ',
			type: [
				{ label: 'OBDII_MODE', value: '0' },
				{ label: 'CAN Bus Listen Mode', value: '1' },
				{ label: 'Tachometer', value: '2' }
			]
		},
		'Activation Point': {
			code: 'ACT',
			type: 'number',
			min: 0,
			max: 16000
		},
		'Animation Direction': {
			code: 'ANIM',
			type: [
				{ label: 'Left to Right', value: '0' },
				{ label: 'Right to left', value: '1' },
				{ label: 'Out to In', value: '2' },
				{ label: 'In to Out', value: '3' }
			]
		},
		Color: {
			code: 'COLOR',
			type: [
				{ label: 'Blue Green Red', value: '0' },
				{ label: 'Green Red Blue', value: '1' },
				{ label: 'Green Red', value: '2' },
				{ label: 'Aura', value: '3' }
			]
		}
	},
	Boost: {}
};
