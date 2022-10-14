
export function validate_config(config) {
  if ( config["configType"] == "RPM" ) {
    let res = true;

    res = config["SHIFT"] <= 1600;
    res = res && config["activation_point"] <= 1600;
    res = res && config["SHIFT"] > config["activation_point"];

    return res;
  }
  return 1;
}
