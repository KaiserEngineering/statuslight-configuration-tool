use mockall::*;
use serde::Serialize;
use serialport::SerialPortInfo;
use serialport::UsbPortInfo;
use std::io::BufRead;
use std::io::BufReader;
use std::sync::Mutex;
use std::{thread, time};

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

enum ActiveConnection {
    Active(Box<dyn serialport::SerialPort>),
    Inactive,
}

lazy_static! {
    static ref ACTIVE_CONNECTION: Mutex<ActiveConnection> = Mutex::new(ActiveConnection::Inactive);
}

#[derive(Debug, Serialize)]
pub struct SerialError {
    error_type: SerialErrors,
    message: String,
}

#[derive(Debug, Serialize)]
pub enum SerialErrors {
    Write,
    Read,
    Port,
}

#[derive(Serialize, Debug, Clone)]
pub struct SerialPort {
    port_name: String,
    port_info: String,
}


// Check if a port is valid and active, if not open a new one.
fn check_active_port(port_name: &str) -> Result<Box<dyn serialport::SerialPort>, String> {
    match ACTIVE_CONNECTION.lock() {
        Ok(mut connection) => {
            if let ActiveConnection::Active(active_port) = &*connection {
                println!("Found an active connection..!");

                // Check if our connection is still alive
                if let Err(error) = active_port.try_clone().unwrap().read_carrier_detect() {
                    eprintln!("Connection invalid {}, attempting to re-open", error);

                    *connection = ActiveConnection::Inactive;

                    let serial_port = serialport::new(port_name, 9600)
                        .timeout(time::Duration::from_millis(500))
                        .open();

                    match serial_port {
                        Err(error) => Err(error.to_string()),
                        Ok(active_port) => {
                            // Sleep while the device reboots
                            let two_seconds = time::Duration::from_secs(2);
                            thread::sleep(two_seconds);

                            *connection =
                                ActiveConnection::Active(active_port.try_clone().unwrap());
                            Ok(active_port)
                        }
                    }
                } else {
                    Ok(active_port.try_clone().unwrap())
                }
            } else {
                println!("Found an Inactive connection..!");
                let serial_port = serialport::new(port_name, 9600)
                    .timeout(time::Duration::from_millis(500))
                    .open();

                match serial_port {
                    Err(error) => Err(error.to_string()),
                    Ok(active_port) => {
                        // Sleep while the device reboots
                        let two_seconds = time::Duration::from_secs(2);
                        thread::sleep(two_seconds);

                        *connection = ActiveConnection::Active(active_port.try_clone().unwrap());
                        Ok(active_port)
                    }
                }
            }
        }
        Err(error) => {
            error.get_ref();
            Err(error.to_string())
        }
    }
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

#[tauri::command]
pub async fn write(content: String, port_name: &str) -> Result<String, SerialError> {
    match check_active_port(port_name) {
        Err(error) => Err(SerialError {
            error_type: SerialErrors::Port,
            message: error,
        }),
        Ok(mut connection) => {
            match connection.write(content.as_bytes()) {
                Ok(write) => {
                    if write as u32 == content.len() as u32 {
                        println!("Successfully wrote to serial");
                        // Confirm our results look good
                        match read_serial(port_name) {
                            Ok(results) => Ok(results),
                            Err(error) => Err(SerialError {
                                error_type: SerialErrors::Read,
                                message: error,
                            }),
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
    }
}

fn read_serial(port_name: &str) -> Result<String, String> {
    match check_active_port(port_name) {
        Err(error) => Err(error),
        Ok(serial_port) => {
            let mut reader = BufReader::new(serial_port);
            let mut my_str = vec![];

            match reader.read_until(b'\n', &mut my_str) {
                Ok(_) => {
                    println!("Successfully read from serial {:?}", my_str);
                    Ok(std::str::from_utf8(&my_str).unwrap().to_string())
                }
                Err(error) => Err(error.to_string()),
            }
        }
    }
}

#[tauri::command]
pub async fn close_active_port() -> Result<String, SerialError> {
    match ACTIVE_CONNECTION.lock() {
        Ok(mut connection) => {
            if let ActiveConnection::Active(_active_port) = &*connection {
                println!("Closing serial port");
                *connection = ActiveConnection::Inactive;
                Ok("Serial Port closed".to_string())
            } else {
                Ok("Serial Port already inactive".to_string())
            }
        }
        Err(error) => Err(SerialError {
            error_type: SerialErrors::Port,
            message: error.to_string(),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_find_ports() {
        tauri::async_runtime::block_on(async move {
            let ports_found = find_available_manager_ports(MockSerialManager).await;

            assert_eq!(1, ports_found.unwrap().len());
        });
    }
}
