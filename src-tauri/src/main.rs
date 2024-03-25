#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub fn main() {
    #[cfg(target_os = "windows")]
    unsafe {
        winapi::um::shellscalingapi::SetProcessDpiAwareness(2);
    }

    keshiftlight_configuration_tool_lib::run();
}
