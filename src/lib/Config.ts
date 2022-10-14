export const ShiftLightConfigs = {
	RPM: {
		'Shift Point': {
			code: 'SHIFT',
			type: 'number',
			min: 0,
			max: 1600,
			info: 'RPM value to flash shift light at.'
		},
		'Acquisition Mode': {
			code: 'aquisition_mode',
			type: [
				{ label: 'OBDII_MODE', value: 'OBDII_MODE' },
				{ label: 'CAN Bus Listen Mode', value: 'CAN Bus Listen Mode' },
				{ label: 'Tachometer', value: 'Tachometer' }
			]
		},
		'Activation Point': {
			code: 'activation_point',
			type: 'number',
			min: 0,
			max: 1600
		},
		Illum: {
			code: 'illum',
			type: 'number'
		},
		'Animation Direction': {
			code: 'ANIMATION_DIRECTION',
			type: [
				{ label: 'Left to Right', value: 'Left to Right' },
				{ label: 'Right to left', value: 'Right to Left' },
				{ label: 'Out to In', value: 'Out to In' },
				{ label: 'In to Out', value: 'In to Out' }
			]
		},
		Color: {
			code: 'color',
			type: [
				{ label: 'Blue Green Red', value: 0 },
				{ label: 'Green Red Blue', value: 1 },
				{ label: 'Green Red', value: 2 },
				{ label: 'Aura', value: 3 }
			]
		}
	},
	Boost: {}
};
