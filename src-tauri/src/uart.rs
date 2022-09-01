use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct SerialError {
    error_type: SerialErrors,
    message: String,
}

#[derive(Debug, Serialize)]
pub enum SerialErrors {
    WriteError,
    PortError,
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
        Err(error) => Err(SerialError {
            error_type: SerialErrors::WriteError,
            message: error.to_string(),
        }),
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
                Ok(_bytes_written) => Ok("Successfully wrote to serial port".to_string()),
                Err(error) => Err(SerialError {
                    error_type: SerialErrors::WriteError,
                    message: error.to_string(),
                }),
            }
        }
        Err(error) => Err(SerialError {
            error_type: SerialErrors::PortError,
            message: error.to_string(),
        }),
    }
}
