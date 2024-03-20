#![feature(error_in_core)]
#![feature(try_trait_v2)]

use std::sync::Arc;

use tauri::{App, Manager};

mod model;
mod serial;

use serial::controller::{
    connect, drop_connection, dtr, find_available_ports, get_connection, massage_devices_list,
    watch_devices, write,
};
use serial::state::SerialState;

use model::controller::{get_latest_firmware, write_hex};
use tokio::sync::Mutex;

pub type SetupHook = Box<dyn FnOnce(&mut App) -> Result<(), Box<dyn std::error::Error>> + Send>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_latest_firmware,
            write_hex,
            get_connection,
            connect,
            write,
            dtr,
            drop_connection,
            find_available_ports,
            watch_devices
        ])
        .setup(|app| {
            let state = match serialport::available_ports() {
                Ok(ports_found) => SerialState {
                    port: Default::default(),
                    connection: Default::default(),
                    baud_rate: 57600,
                    ports: Arc::new(Mutex::new(massage_devices_list(&ports_found))),
                },
                Err(err) => {
                    eprint!("Could not get initial available_ports {err:?}");
                    SerialState {
                        port: Default::default(),
                        connection: Default::default(),
                        baud_rate: 57600,
                        ports: Default::default(),
                    }
                }
            };
            app.manage(state);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
