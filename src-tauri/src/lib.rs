#![feature(error_in_core)]
#![feature(try_trait_v2)]

use tauri::App;

mod model;

use model::controller::{get_latest_firmware, new_connection_event, write_hex};

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
        tauri::Builder::default()
            .plugin(tauri_plugin_serial::init())
            .invoke_handler(tauri::generate_handler![
                get_latest_firmware,
                write_hex,
                new_connection_event,
            ])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    }
}
