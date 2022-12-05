//! Controller entry point for our frontend to access, this is where
//! our tauri::command's should be located!

use core::time;
use std::{collections::HashMap, thread};
use tauri::State;

use crate::{store::SerialConnection, Session};

use super::{
    find_available_manager_ports, get, send_dtr,
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
pub async fn get_connection(
    serial_connection: State<'_, SerialConnection>,
) -> Result<String, String> {
    //! Returns the current connecion for our Tauri state
    let lock = serial_connection.port.lock().await;
    match &*lock {
        Some(port) => Ok(port.name().unwrap()),
        None => Err("No port".to_string()),
    }
}

#[tauri::command]
pub async fn connect(
    port_name: String,
    serial_connection: State<'_, SerialConnection>,
    session: State<'_, Session>,
) -> Result<String, String> {
    //! Connect to selected serial port based on port name
    println!("Model::Controller::connect called for {}", port_name);

    let port_binding = serial_connection.clone();
    let mut port_binding = port_binding.port.lock().await;

    // If we have a valid connection for the port we are trying to connect to,
    // there is nothing to do.
    if !port_binding.is_none() && port_binding.as_ref().unwrap().name().unwrap() == port_name {
        println!("Found existing connection");
        return Ok("Found existing connection".to_string());
    }

    let serial_port = serialport::new(&port_name, 57600)
        .timeout(time::Duration::from_millis(500))
        .open();

    match serial_port {
        Err(err) => {
            println!("Could not open port '{}': {}", port_name, err);

            Err(format!("Couldn't open serial port: {}", err))
        }
        Ok(active_port) => {
            println!("New port connection opened");

            *session.port_name.lock().await = port_name.to_string();
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
            let sleep = time::Duration::from_millis(200);
            thread::sleep(sleep);

            Ok("New connection established".to_string())
        }
    }
}

#[tauri::command]
pub async fn write(
    session: State<'_, Session>,
    conn: State<'_, SerialConnection>,
    content: String,
) -> Result<String, uart::SerialError> {
    //! Write string content to connected serial port.
    let conn_clone = conn.clone();

    if let Err(e) = SerialConnection::validate_connection(session, conn_clone).await {
        return Err(super::SerialError {
            error_type: SerialErrors::Write,
            message: e,
        });
    }

    let port_binding = conn.clone();
    let mut port_conn = port_binding.port.lock().await;

    match port_conn.as_mut() {
        Some(port) => write_serial(port, content).await,
        None => Err(super::SerialError {
            error_type: SerialErrors::Write,
            message: "No connection found".into(),
        }),
    }
}

#[tauri::command]
pub async fn get_latest_firmware() -> Result<HashMap<String, String>, String> {
    let mut content = HashMap::new();

    content.insert(
        "version".into(),
        get("https://raw.githubusercontent.com/KaiserEngineering/shiftlight-versioning/main/version.txt".to_string()).await?
    );

    content.insert(
        "hex".into(),
        get("https://raw.githubusercontent.com/KaiserEngineering/shiftlight-versioning/main/shiftlight.hex".to_string()).await?
    );

    content.insert(
        "changelog".into(),
        get("https://raw.githubusercontent.com/KaiserEngineering/shiftlight-versioning/main/changelog.md".to_string()).await?
    );

    Ok(content)
}

#[tauri::command]
pub async fn dtr(
    serial_connection: State<'_, SerialConnection>,
    level: bool,
) -> Result<String, SerialError> {
    let port_binding = serial_connection.clone();
    let mut port_conn = port_binding.port.lock().await;

    match port_conn.as_mut() {
        Some(port) => send_dtr(port, level).await,
        None => Err(super::SerialError {
            error_type: SerialErrors::Write,
            message: "No connection found".into(),
        }),
    }
}

#[tauri::command]
pub async fn write_hex(
    serial_connection: State<'_, SerialConnection>,
    hex: String,
) -> Result<String, SerialError> {
    let port_binding = serial_connection.clone();
    let mut port_conn = port_binding.port.lock().await;

    match port_conn.as_mut() {
        Some(port) => {
            let lines = hex.split('\n');
            for line in lines {
                // Skip empty line (last one)
                if line == "" {
                    continue;
                }
                match write_serial(port, format!("{}\n", line.to_string())).await {
                    Err(e) => {
                        return Err(super::SerialError {
                            error_type: SerialErrors::Write,
                            message: format!("{:?} for line {}", e.message, line),
                        });
                    }
                    _ => {
                        println!("Wrote line: {}", line);
                    }
                }
            }

            Ok("Successfully updated firmware!".to_string())
        }
        None => Err(super::SerialError {
            error_type: SerialErrors::Write,
            message: "Something went wrong getting active connection".into(),
        }),
    }
}
