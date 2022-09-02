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

pub fn write(
    mut serial_port: Box<dyn serialport::SerialPort>,
    content: String,
) -> Result<String, SerialError> {
    match serial_port.write(content.as_bytes()) {
        Ok(write) => {
            if write as u32 == content.len() as u32 {
                // Confirm our results look good
                match read_serial(serial_port) {
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

fn read_serial(serial_port: Box<dyn serialport::SerialPort>) -> Result<String, String> {
    let mut reader = BufReader::new(serial_port);
    let mut my_str = vec![]; //String::new();

    match reader.read_until(b'\n', &mut my_str) {
        Ok(_) => Ok(std::str::from_utf8(&my_str).unwrap().to_string()),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn write_config(
    port_name: String,
    config: Vec<String>,
) -> Result<Vec<Result<String, SerialError>>, SerialError> {
    let serial_port = serialport::new(port_name, 9600)
        .timeout(time::Duration::from_millis(500))
        .open();

    let mut results: Vec<Result<String, SerialError>> = vec![];
    match serial_port {
        Err(error) => Err(SerialError {
            error_type: SerialErrors::Port,
            message: error.to_string(),
        }),
        Ok(port) => {
            // Sleep while the device reboots
            let two_seconds = time::Duration::from_secs(2);
            thread::sleep(two_seconds);

            for option in config {
                // Can break during clone here
                results.push(write(port.try_clone().unwrap(), option));
            }

            Ok(results)
        }
    }
}
