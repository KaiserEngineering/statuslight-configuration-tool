use serialport::{SerialPortInfo, SerialPortType};

pub(crate) fn available_ports() -> Result<Vec<SerialPortInfo>, String> {
    Ok(vec![SerialPortInfo {
        port_name: "TestPort".to_string(),
        port_type: SerialPortType::Unknown,
    }])
}
