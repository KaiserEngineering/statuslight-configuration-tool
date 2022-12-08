#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![feature(error_in_core)]
#![feature(try_trait_v2)]

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

fn main() {
    tauri::Builder::default()
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
