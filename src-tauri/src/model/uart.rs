use std::io::{BufRead, BufReader};

use serde::Serialize;
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
            println!("Successfully read from serial {:?}", my_str);

            let mut output = std::str::from_utf8(&my_str).unwrap().to_string();
            // Strip new line endings
            if output.ends_with('\n') {
                output.pop();
                if output.ends_with('\r') {
                    output.pop();
                }
            }

            if output == "ERROR" {
                println!("Failed to read: {:?}", output);

                return Err(SerialError {
                    error_type: SerialErrors::Read,
                    message: output,
                });
            }
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
pub fn write_serial(
    connection: &mut Box<dyn serialport::SerialPort>,
    content: String,
) -> Result<String, SerialError> {
    match connection.write(content.as_bytes()) {
        Ok(write) => {
            // HANDLE FLUSH
            match connection.flush() {
                Ok(_) => {
                    if write as u32 == content.len() as u32 {
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
            }
        }
        Err(error) => Err(SerialError {
            error_type: SerialErrors::Write,
            message: error.to_string(),
        }),
    }
}
