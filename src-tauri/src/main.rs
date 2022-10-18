#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![feature(error_in_core)]

use std::sync::Mutex;

use crate::prelude::*;

mod model;
mod prelude;
mod store;

use model::controller::{connect, write};
use model::system::find_available_ports;
use store::SerialConnection;

pub struct Session {
    pub port_name: Mutex<String>,
}

#[tokio::main]
async fn main() -> MyResult<()> {
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
            connect
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
