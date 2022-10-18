use core::time;
use tauri::State;

use crate::{store::SerialConnection, Session};

use super::{
    uart::{self, write_serial},
    SerialErrors,
};

#[tauri::command]
pub fn connect(
    port_name: &str,
    serial_connection: State<SerialConnection>,
    session: State<Session>,
) -> Result<String, String> {
    println!("Model::Controller::connect called for {}", port_name);

    let serial_port = serialport::new(port_name, 9600)
        .timeout(time::Duration::from_millis(500))
        .open();

    match serial_port {
        Err(err) => {
            println!("Could not open port '{}': {}", port_name, err);

            Err(format!("Couldn't open serial port: {}", err))
        }
        Ok(active_port) => {
            println!("New port connection opened");

            *session.port_name.lock().unwrap() = port_name.to_string();
            *serial_connection.port.lock().unwrap() = Some(active_port);

            Ok("New connectoin established".to_string())
        }
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

    write_serial(port_conn.as_mut().unwrap(), content)
}
