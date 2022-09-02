use serde::Serialize;
use std::io::BufRead;
use std::io::BufReader;
use std::{thread, time};

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
            error_type: SerialErrors::Write,
            message: error.to_string(),
        }),
    }
}

#[tauri::command]
pub fn write(port_name: String, content: String) -> Result<String, SerialError> {
    let port = serialport::new(port_name, 9600).open();
    match port {
        Err(error) => Err(SerialError {
            error_type: SerialErrors::Port,
            message: error.to_string(),
        }),
        Ok(mut port) => {
            println!("Sleeping...");
            let one_second = time::Duration::from_secs(2);
            thread::sleep(one_second);
            println!("awake...");

            match port.write(content.as_bytes()) {
                Ok(write) => {
                    if write as u32 == content.len() as u32 {
                        // Confirm our results look good
                        match read_serial(port) {
                            Ok(results) => {
                                println!("Read from uart {}", results);
                                Ok(results)
                            }
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

fn read_serial(serial_port: Box<dyn serialport::SerialPort>) -> Result<String, String> {
    let mut reader = BufReader::new(serial_port);
    let mut my_str = String::new();

    match reader.read_line(&mut my_str) {
        Ok(_) => Ok(my_str.to_string()),
        Err(error) => Err(error.to_string()),
    }
}
