use serde::Serialize;

#[cfg(not(test))]
use serialport::available_ports;

#[cfg(test)]
use serialport::{SerialPortInfo, SerialPortType};
#[cfg(test)]
fn available_ports() -> Result<Vec<SerialPortInfo>, String> {
    Ok(vec![SerialPortInfo {
        port_name: "TestPort".to_string(),
        port_type: SerialPortType::Unknown,
    }])
}

#[derive(Serialize)]
pub struct SerialPort {
    port_name: String,
}

#[tauri::command]
pub fn find_available_ports() -> Result<Vec<SerialPort>, String> {
    // Return vec of all ports found on device
    match available_ports() {
        Ok(ports) => {
            Ok(ports
                .iter()
                .map(|p| {
                    // Right now we only grab Port name
                    SerialPort {
                        port_name: p.port_name.clone(),
                    }
                })
                .collect())
        }
        Err(error) => Err(error.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // this brings everything from parent's scope into this scope
    #[test]
    fn test_find_available_ports() {
        let ports = find_available_ports().unwrap();
        assert_eq!(ports.len(), 1, "Found one port!");

        assert_eq!(
            ports[0].port_name, "TestPort",
            "Port name set correctly via SerialPort struct"
        );
    }
}
