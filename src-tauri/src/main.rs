#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// #[link(name = "ke_shiftlight", kind = "static")]
// extern "C" {
//     fn get_rpm() -> i32;
//     fn set_rpm(rpm: i32) -> i8;
// }

pub fn main() {
    app::AppBuilder::new().run();
}
