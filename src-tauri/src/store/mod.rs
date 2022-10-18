//! Handle our state
use std::sync::Mutex;

use tauri::State;

use crate::{model::controller::connect, Session};

pub struct SerialConnection {
    pub port: Mutex<Option<Box<dyn serialport::SerialPort>>>,
}

impl SerialConnection {
    pub fn validate_connection(
        session: State<Session>,
        port: State<SerialConnection>,
    ) -> Result<String, String> {
        let port_guard = port.port.try_lock().unwrap();

        if port_guard.is_none() {
            let session_copy = session.clone();
            let port_name = session_copy.port_name.lock().unwrap();
            drop(port_guard);

            if let Err(error) = connect(&port_name, port, session) {
                return Err(error.to_string());
            } else {
                return Ok("Connection looks good".to_string());
            }
        }

        Ok("Session is good".to_string())
    }
}
