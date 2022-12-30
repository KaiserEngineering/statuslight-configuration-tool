//! Controller entry point for our frontend to access, this is where
//! our tauri::command's should be located!

use std::collections::HashMap;
use tauri::Manager;
use tauri::State;
use tauri::Window;

use super::get;

use tauri_plugin_serial::command::{write_serial, SerialError, SerialErrors};
use tauri_plugin_serial::state::SerialState;

// Command to emit an event and propagate that a
// new connection was made and the $config store was
// updated.
#[tauri::command]
pub fn new_connection_event(app_handle: tauri::AppHandle) {
    if let Err(e) = app_handle.emit_all("new-connection", ()) {
        eprintln!("Error emiting new-connection event: {e:?}");
    }
}

#[tauri::command]
pub async fn get_latest_firmware() -> Result<HashMap<String, String>, String> {
    let mut content = HashMap::new();

    content.insert(
        "version".into(),
        get("https://raw.githubusercontent.com/KaiserEngineering/shiftlight-versioning/main/version.txt".to_string()).await?
    );

    content.insert(
        "hex".into(),
        get("https://raw.githubusercontent.com/KaiserEngineering/shiftlight-versioning/main/shiftlight.hex".to_string()).await?
    );

    content.insert(
        "changelog".into(),
        get("https://raw.githubusercontent.com/KaiserEngineering/shiftlight-versioning/main/changelog.md".to_string()).await?
    );

    Ok(content)
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    percentage: i32,
}

#[tauri::command]
pub async fn write_hex(
    serial_state: State<'_, SerialState>,
    window: Window,
    hex: String,
) -> Result<String, SerialError> {
    let mut guard = serial_state.connection.lock().await;

    let mut progress = 0.0;
    match &mut *guard {
        Some(port) => {
            let lines = hex.split('\n');
            let num_lines = lines.clone().count() as f32;

            for line in lines {
                // Skip empty line (last one)
                if line.is_empty() {
                    continue;
                }
                match write_serial(port, format!("{line}\n")).await {
                    Err(e) => {
                        return Err(SerialError {
                            error_type: SerialErrors::Write,
                            message: format!("{:?} for line {}", e.message, line),
                        });
                    }
                    _ => {
                        progress += 1.0;
                        let base = (progress * 100.0) / num_lines;
                        let percentage = base.round() as i32;

                        if let Err(e) = window.emit("PROGRESS", Payload { percentage }) {
                            return Err(SerialError {
                                error_type: SerialErrors::Write,
                                message: format!(
                                    "Failed to emit progress updates -- bailing: {e:?}"
                                ),
                            });
                        }
                        // println!("Wrote line: {}", line);
                    }
                }
            }

            Ok("Successfully updated firmware!".to_string())
        }
        None => Err(SerialError {
            error_type: SerialErrors::Write,
            message: "Something went wrong getting active connection".into(),
        }),
    }
}
