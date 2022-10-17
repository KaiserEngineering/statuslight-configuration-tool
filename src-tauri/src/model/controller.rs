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
    session: State<Session>,
    serial_connection: State<SerialConnection>,
) -> Result<String, String> {
    println!("Attempting to connect to port {}", port_name);

    let serial_port = serialport::new(port_name, 9600)
        .timeout(time::Duration::from_millis(500))
        .open();

    match serial_port {
        Err(err) => Err(format!("Couldn't open serial port: {}", err.to_string())),
        Ok(active_port) => {
            *serial_connection.port.lock().unwrap() = Some(active_port);
            *session.port_name.lock().unwrap() = port_name.to_string();
            Ok("New connection established".into())
        }
    }
}

#[tauri::command]
pub fn read(
    session: State<Session>,
    conn: State<SerialConnection>,
) -> Result<String, uart::SerialError> {
    match SerialConnection::validate_connection(session, conn) {
        Ok(_) => read_serial(&mut conn.port.lock().unwrap().unwrap()),
        Err(e) => Err(super::SerialError {
            error_type: SerialErrors::Write,
            message: e,
        }),
    }
}

#[tauri::command]
pub fn write(
    session: State<Session>,
    conn: State<SerialConnection>,
    content: String,
) -> Result<String, uart::SerialError> {
    match SerialConnection::validate_connection(session, conn) {
        Ok(_) => {
            let port_binding = conn.clone();
            let port_conn = port_binding.port.lock().unwrap();

            write_serial(&mut port_conn.unwrap(), content)
        }
        Err(e) => Err(super::SerialError {
            error_type: SerialErrors::Write,
            message: e,
        }),
    }
}
