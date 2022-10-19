//! Controller entry point for our frontend to access, this is where
//! our tauri::command's should be located!

use core::time;
use std::thread;
use tauri::State;

use crate::{store::SerialConnection, Session};

use super::{
    find_available_manager_ports,
    uart::{self, write_serial},
    RealSerialManager, SerialError, SerialErrors, SerialPort,
};

#[tauri::command]
pub async fn find_available_ports() -> Result<Vec<SerialPort>, SerialError> {
    //! Wrapper that calls find_available_manager_ports which will then call the
    //! code to find the available serial ports on the machine.
    find_available_manager_ports(RealSerialManager).await
}

#[tauri::command]
pub fn get_connection(serial_connection: State<SerialConnection>) -> Result<String, String> {
    //! Returns the current connecion for our Tauri state
    match serial_connection.port.lock().unwrap().as_ref() {
        Some(port) => Ok(port.name().unwrap()),
        None => Err("No port".to_string()),
    }
}

#[tauri::command]
pub fn connect(
    port_name: &str,
    serial_connection: State<SerialConnection>,
    session: State<Session>,
) -> Result<String, String> {
    //! Connect to selected serial port based on port name
    println!("Model::Controller::connect called for {}", port_name);

    let port_binding = serial_connection.clone();
    let mut port_binding = port_binding.port.lock().unwrap();

    // If we have a valid connection for the port we are trying to connect to,
    // there is nothing to do.
    if !port_binding.is_none() && port_binding.as_ref().unwrap().name().unwrap() == port_name {
        println!("Found existing connection");
        return Ok("Found existing connection".to_string());
    }

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
            *port_binding = Some(active_port);

            if let Err(e) = port_binding
                .as_mut()
                .unwrap()
                .write_data_terminal_ready(true)
            {
                return Err(e.to_string());
            }
            println!("DTR signal written");

            // Sleep while the device reboots
            let two_seconds = time::Duration::from_secs(2);
            thread::sleep(two_seconds);

            Ok("New connection established".to_string())
        }
    }
}

#[tauri::command]
pub fn write(
    session: State<Session>,
    conn: State<SerialConnection>,
    content: String,
) -> Result<String, uart::SerialError> {
    //! Write string content to connected serial port.
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
