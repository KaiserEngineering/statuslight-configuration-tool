fn main() {
    // Link our ShiftLight firmware
    if let Ok(path) = std::env::var("SHIFTLIGHTXPATH") {
        cc::Build::new()
            .file(format!("{}/ke_shiftlight.c", path))
            .flag("-DSIMULATE")
            .include(format!("{}", path))
            .compile("ke_shiftlight");
    } else {
        eprint!("Could not link firmware!")
    }

    tauri_build::build()
}
