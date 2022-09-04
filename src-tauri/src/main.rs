#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod uart;
use uart::{find_available_ports, write_config};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![find_available_ports, write_config,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
