export function validate_config(config) {
	if (config['configType'] == 'RPM') {
		let res = true;

		res = res && config['SHIFT'] > config['activation_point'];

		return { is_valid: res, error: 'Shift Point must be greater than Activation Point' };
	}
	return 1;
}
