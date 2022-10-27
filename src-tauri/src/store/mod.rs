//! Handle our state
use tokio::sync::Mutex;

use tauri::State;

use crate::{model::controller::connect, Session};

pub struct SerialConnection {
    pub port: Mutex<Option<Box<dyn serialport::SerialPort>>>,
}

impl SerialConnection {
    pub async fn validate_connection(
        session: State<'_, Session>,
        port: State<'_, SerialConnection>,
    ) -> Result<String, String> {
        match port.port.try_lock() {
            Ok(_) => Ok("Old session is good".to_string()),
            _ => {
                let session_copy = session.clone();
                let port_name = session_copy.port_name.lock().await;

                connect(port_name.to_string(), port.clone(), session).await?;

                Ok("New session is good".to_string())
            }
        }
    }
}
