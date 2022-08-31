use std::fmt;

use serde::Serialize;
use serialport::available_ports;

#[derive(Debug, Serialize)]
pub enum SerialError {
    Error(String),
}

impl fmt::Display for SerialError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "An Error Occurred, Please Try Again!") // user-facing output
    }
}

#[derive(Serialize, Debug)]
pub struct SerialPort {
    port_name: String,
}

#[tauri::command]
pub fn find_available_ports() -> Result<Vec<SerialPort>, SerialError> {
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
        Err(error) => Err(SerialError::Error(error.to_string())),
    }
}
