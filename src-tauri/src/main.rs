#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[macro_use]
extern crate lazy_static;

mod uart;
use uart::{find_available_ports, write};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![find_available_ports, write])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
