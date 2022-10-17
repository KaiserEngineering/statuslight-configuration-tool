use serde::Serialize;
use serialport::SerialPortInfo;

use super::{SerialError, SerialErrors};

/// A trait that abstracts over the function(s) you want to mock out in tests
trait SerialManager {
    fn available_ports(&self) -> Result<Vec<SerialPortInfo>, serialport::Error>;
}

/// A struct which implements the trait to call the real function.
struct RealSerialManager;

impl SerialManager for RealSerialManager {
    fn available_ports(&self) -> Result<Vec<SerialPortInfo>, serialport::Error> {
        serialport::available_ports()
    }
}

#[derive(Serialize, Debug, Clone)]
pub struct SerialPort {
    port_name: String,
    port_info: String,
}

/// The function that is generic over the manager. Can be private if desired.
async fn find_available_manager_ports<M: SerialManager>(
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

#[tauri::command]
pub async fn find_available_ports() -> Result<Vec<SerialPort>, SerialError> {
    // Return vec of all ports found on device
    find_available_manager_ports(RealSerialManager).await
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
