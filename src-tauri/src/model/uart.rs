use std::io::{BufRead, BufReader};
use ts_rs::TS;

use serde::Serialize;
use serialport::SerialPortInfo;
#[derive(Debug, Serialize, TS)]
#[ts(export)]
pub enum SerialErrors {
    Write,
    Read,
    Boot,
}

#[derive(Serialize, Debug, Clone, TS)]
#[ts(export)]
pub struct SerialPort {
    port_name: String,
    port_info: String,
}

#[derive(Debug, Serialize, TS)]
#[ts(export)]
pub struct SerialError {
    pub error_type: SerialErrors,
    pub message: String,
}

pub fn read_serial(
    connection: &mut Box<dyn serialport::SerialPort>,
) -> Result<String, SerialError> {
    let mut buf = vec![];
    let mut b_reader = BufReader::with_capacity(1, connection);

    if let Err(error) = b_reader.read_until(0x0A, &mut buf) {
        eprintln!("Reading error: {:?}", error);
        return Err(SerialError {
            error_type: SerialErrors::Read,
            message: error.to_string(),
        });
    }
    let mut output = std::str::from_utf8(&buf).unwrap().to_string();

    // Strip new line endings
    output = output.replace('\n', "");

    if output == "ERROR" || output == "nok" {
        println!("Failed to read/write: {:?}", output);

        return Err(SerialError {
            error_type: SerialErrors::Read,
            message: output,
        });
    }

    println!("Successfully read from serial {:?}", output);
    Ok(output)
}

// Write our data via Serial
pub async fn write_serial(
    connection: &mut Box<dyn serialport::SerialPort>,
    content: String,
) -> Result<String, SerialError> {
    match connection.write(content.as_bytes()) {
        Ok(write) => {
            if let Err(error) = connection.flush() {
                Err(SerialError {
                    error_type: SerialErrors::Write,
                    message: error.to_string(),
                })
            } else if write as u32 == content.len() as u32 {
                let content = content.replace('\n', "");
                println!("Successfully sent write to serial: {}", content);

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

pub async fn send_dtr(
    conn: &mut Box<dyn serialport::SerialPort>,
    level: bool,
) -> Result<String, SerialError> {
    // Sent DTR signal
    if let Err(e) = conn.write_data_terminal_ready(level) {
        return Err(SerialError {
            error_type: SerialErrors::Boot,
            message: format!("Ran into issue sending DTR signal {:?}", e),
        });
    }
    println!("Wrote DTR signal to level {:?}", level);
    Ok("DTR signal successfully sent".into())
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
