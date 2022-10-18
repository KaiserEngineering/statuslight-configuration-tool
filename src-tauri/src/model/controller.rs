use core::time;
use tauri::State;

use crate::{store::SerialConnection, Session};

use super::{
    uart::{self, read_serial, write_serial},
    SerialErrors,
};

#[tauri::command]
pub fn connect(
    port_name: &str,
    serial_connection: State<SerialConnection>,
    session: State<Session>,
) -> Result<String, String> {
    println!("Attempting to connect to port {}", port_name);

    let serial_port = serialport::new(port_name, 9600)
        .timeout(time::Duration::from_millis(500))
        .open();

    match serial_port {
        Err(err) => {
            println!("Could not open port '{}': {}", port_name, err);

            drop(serial_connection);
            Err(format!("Couldn't open serial port: {}", err.to_string()))
        }
        Ok(active_port) => {
            *serial_connection.port.lock().unwrap() = Some(active_port);
            *session.port_name.lock().unwrap() = port_name.to_string();

            drop(serial_connection);

            Ok("New connectoin established".to_string())
        }
    }
}

#[tauri::command]
pub fn read(
    session: State<Session>,
    conn: State<SerialConnection>,
) -> Result<String, uart::SerialError> {
    let conn_clone = conn.clone();

    if let Err(e) = SerialConnection::validate_connection(session, conn_clone) {
        Err(super::SerialError {
            error_type: SerialErrors::Write,
            message: e,
        })
    } else {
        let port_binding = conn.clone();
        let mut port_conn = port_binding.port.lock().unwrap();

        read_serial(&mut port_conn.as_mut().unwrap())
    }
}

#[tauri::command]
pub fn write(
    session: State<Session>,
    conn: State<SerialConnection>,
    content: String,
) -> Result<String, uart::SerialError> {
    let conn_clone = conn.clone();

    if let Err(e) = SerialConnection::validate_connection(session, conn_clone) {
        return Err(super::SerialError {
            error_type: SerialErrors::Write,
            message: e,
        });
    }

    let port_binding = conn.clone();
    let mut port_conn = port_binding.port.lock().unwrap();

    write_serial(&mut port_conn.as_mut().unwrap(), content)
}
