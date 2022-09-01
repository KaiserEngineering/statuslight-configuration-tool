use std::fmt;

use serde::Serialize;

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
    match serialport::available_ports() {
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

#[tauri::command]
pub fn send_message(port_name: String, content: String) -> Result<String, SerialError> {
    let port = serialport::new(port_name, 9600).open();
    match port {
        Ok(mut port) => {
            // Opened our port successfully
            let results = port.write(content.as_bytes());
            match results {
                Ok(bytes_written) => Ok(bytes_written.to_string()),
                Err(error) => Err(SerialError::Error(error.to_string())),
            }
        }
        Err(error) => Err(SerialError::Error(error.to_string())),
    }
}
