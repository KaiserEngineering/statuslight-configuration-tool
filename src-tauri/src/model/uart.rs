use std::io::{BufRead, BufReader};

use serde::Serialize;
use serialport::SerialPortInfo;
#[derive(Debug, Serialize)]
pub enum SerialErrors {
    Write,
    Read,
}

#[derive(Serialize, Debug, Clone)]
pub struct SerialPort {
    port_name: String,
    port_info: String,
}

#[derive(Debug, Serialize)]
pub struct SerialError {
    pub error_type: SerialErrors,
    pub message: String,
}

pub fn read_serial(
    connection: &mut Box<dyn serialport::SerialPort>,
) -> Result<String, SerialError> {
    let mut reader = BufReader::new(connection);
    let mut my_str = vec![];

    match reader.read_until(b'\n', &mut my_str) {
        Ok(_) => {
            let mut output = std::str::from_utf8(&my_str).unwrap().to_string();

            // Strip new line endings
            output = output.replace('\n', "");

            if output == "ERROR" {
                println!("Failed to read: {:?}", output);

                return Err(SerialError {
                    error_type: SerialErrors::Read,
                    message: output,
                });
            }
            println!("Successfully read from serial {:?}", output);
            Ok(output)
        }
        Err(error) => {
            println!("Failed to read: {:?}", error.to_string());

            Err(SerialError {
                error_type: SerialErrors::Read,
                message: error.to_string(),
            })
        }
    }
}

// Write our data via Serial
pub async fn write_serial(
    connection: &mut Box<dyn serialport::SerialPort>,
    content: String,
) -> Result<String, SerialError> {
    match connection.write(content.as_bytes()) {
        Ok(write) => match connection.flush() {
            Ok(_) => {
                if write as u32 == content.len() as u32 {
                    let content = content.replace('\n', "");
                    println!("Successfully wrote to serial: {}", content);

                    match read_serial(connection) {
                        Err(e) => Err(e),
                        Ok(res) => Ok(res),
                    }
                } else {
                    Err(SerialError {
                        error_type: SerialErrors::Write,
                        message: format!(
                            "Incomplete write only wrote {} bytes of {}",
                            write,
                            content.len()
                        ),
                    })
                }
            }
            Err(error) => Err(SerialError {
                error_type: SerialErrors::Write,
                message: error.to_string(),
            }),
        },
        Err(error) => Err(SerialError {
            error_type: SerialErrors::Write,
            message: error.to_string(),
        }),
    }
}

/// A trait that abstracts over the function(s) you want to mock out in tests
pub trait SerialManager {
    fn available_ports(&self) -> Result<Vec<SerialPortInfo>, serialport::Error>;
}

/// A struct which implements the trait to call the real function.
pub struct RealSerialManager;

impl SerialManager for RealSerialManager {
    fn available_ports(&self) -> Result<Vec<SerialPortInfo>, serialport::Error> {
        serialport::available_ports()
    }
}

/// The function that is generic over the manager. Can be private if desired.
pub async fn find_available_manager_ports<M: SerialManager>(
    manager: M,
) -> Result<Vec<SerialPort>, SerialError> {
    // Return vec of all ports found on device
    match manager.available_ports() {
        Ok(ports) => {
            Ok(ports
                .iter()
                .map(|p| {
                    // Right now we only grab Port name
                    SerialPort {
                        port_name: p.port_name.clone(),
                        port_info: match &p.port_type {
                            serialport::SerialPortType::UsbPort(info) => {
                                info.product.clone().unwrap()
                            }
                            _ => "".to_string(),
                        },
                    }
                })
                .collect())
        }
        Err(error) => Err(SerialError {
            error_type: SerialErrors::Write,
            message: error.to_string(),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serialport::UsbPortInfo;

    /// A struct which implements the trait to return mock data without calling the "actual" implementation.
    struct MockSerialManager;

    impl SerialManager for MockSerialManager {
        fn available_ports(&self) -> Result<Vec<SerialPortInfo>, serialport::Error> {
            // Return mock data.
            Ok(vec![serialport::SerialPortInfo {
                port_type: serialport::SerialPortType::UsbPort(UsbPortInfo {
                    vid: 1,
                    pid: 2,
                    serial_number: Some("serial_number".into()),
                    manufacturer: Some("kaiserengineering".into()),
                    product: Some("SHIFTLIGHT".into()),
                }),
                port_name: "Dog".to_string(),
            }])
        }
    }

    #[test]
    fn test_find_ports() {
        tauri::async_runtime::block_on(async move {
            let ports_found = find_available_manager_ports(MockSerialManager).await;

            assert_eq!(1, ports_found.unwrap().len());
        });
    }
}