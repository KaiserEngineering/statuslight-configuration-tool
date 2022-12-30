fn main() {
    // Link our ShiftLight firmware
    if let Ok(path) = std::env::var("SHIFTLIGHTXPATH") {
        cc::Build::new()
            .file(format!("{path}/ke_shiftlight.c"))
            .flag("-DSIMULATE")
            .include(path)
            .compile("ke_shiftlight");
    } else {
        eprint!("Could not link firmware!")
    }

    tauri_build::build()
}
