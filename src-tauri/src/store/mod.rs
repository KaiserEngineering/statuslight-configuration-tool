//! Handle our state
use std::sync::Mutex;

use tauri::State;

use crate::{model::controller::connect, Session};

pub struct SerialConnection {
    pub port: Mutex<Option<Box<dyn serialport::SerialPort>>>,
}

impl SerialConnection {
    /// .
    ///
    /// # Panics
    ///
    /// Panics if .
    ///
    /// # Errors
    ///
    /// This function will return an error if .
    pub fn validate_connection(
        session: State<Session>,
        port: State<SerialConnection>,
    ) -> Result<String, String> {
        let port_guard = port.port.try_lock().unwrap();

        if port_guard.is_none() {
            let session_copy = session.clone();
            let port_name = session_copy.port_name.lock().unwrap();

            drop(port_guard);

            connect(&port_name, port, session)?;
        }

        Ok("Session is good".to_string())
    }
}
