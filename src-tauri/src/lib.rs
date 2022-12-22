#![feature(error_in_core)]
#![feature(try_trait_v2)]

use tauri::App;

use tokio::sync::Mutex;

mod model;
mod store;

use model::controller::{
    connect, dtr, find_available_ports, get_connection, get_latest_firmware, new_connection_event,
    write, write_hex,
};
use store::SerialConnection;

pub struct Session {
    pub port_name: Mutex<String>,
}

#[cfg(mobile)]
mod mobile;
#[cfg(mobile)]
pub use mobile::*;

pub type SetupHook = Box<dyn FnOnce(&mut App) -> Result<(), Box<dyn std::error::Error>> + Send>;

#[derive(Default)]
pub struct AppBuilder {
    setup: Option<SetupHook>,
}

impl AppBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    #[must_use]
    pub fn setup<F>(mut self, setup: F) -> Self
    where
        F: FnOnce(&mut App) -> Result<(), Box<dyn std::error::Error>> + Send + 'static,
    {
        self.setup.replace(Box::new(setup));
        self
    }

    pub fn run(self) {
        let setup = self.setup;
        tauri::Builder::default()
            .setup(move |app| {
                if let Some(setup) = setup {
                    (setup)(app)?;
                }
                Ok(())
            })
            // Manage our connection and create our session
            .manage(SerialConnection {
                port: Default::default(),
            })
            .manage(Session {
                port_name: Mutex::new("".to_string()),
            })
            .invoke_handler(tauri::generate_handler![
                find_available_ports,
                write,
                connect,
                get_connection,
                get_latest_firmware,
                dtr,
                write_hex,
                new_connection_event
            ])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    }
}
