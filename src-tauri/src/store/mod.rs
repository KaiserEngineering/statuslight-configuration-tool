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
        let binding = session.clone();
        let binding = binding.port_name.lock().unwrap();
        let port_name = binding.as_str();

        let port_binding = port.clone();
        let port_conn = port_binding.port.lock().unwrap();

        if port_conn.is_none() {
            return connect(&port_name, session.to_owned(), port);
        }

        Ok("Existing connection found".to_owned())
    }
}
