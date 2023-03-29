export function validate_config(config) {
	if (config['configType'] == 'RPM') {
		let res = true;

		res = config['SHIFT'] > config['ACT'];

		return { is_valid: res, error: 'Shift Point must be greater than Activation Point' };
	}
	return { is_valid: 1 };
}
