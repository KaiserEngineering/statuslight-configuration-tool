use serde::Serialize;
use std::io::BufRead;
use std::io::BufReader;
use std::sync::Mutex;
use std::{thread, time};

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

#[derive(Serialize, Debug)]
pub struct SerialPort {
    port_name: String,
}

/*
Check if a port is valid and active, if not open a new one.
*/
fn check_active_port(port_name: &str) -> Result<Box<dyn serialport::SerialPort>, String> {
    match ACTIVE_CONNECTION.lock() {
        Ok(mut connection) => {
            match &*connection {
                ActiveConnection::Active(active_port) => {
                    println!("Found an active connection..!");
                    Ok(active_port.try_clone().unwrap())
                }
                ActiveConnection::Inactive => {
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

                            *connection =
                                ActiveConnection::Active(active_port.try_clone().unwrap());
                            Ok(active_port)
                        }
                    }
                }
            }
        }
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn find_available_ports() -> Result<Vec<SerialPort>, SerialError> {
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
            error_type: SerialErrors::Write,
            message: error.to_string(),
        }),
    }
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
