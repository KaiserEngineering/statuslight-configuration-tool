# shift-light-configuration-tool

GUI tool for configuring the KaiserEngineering ShiftLight. This tool allows for easy updating to configurations as well as firmware updates.

## Development

Start by installing Rust and Tauri by following [these docs](https://tauri.app/v1/guides/getting-started/prerequisites)

Once complete clone this repo and run the following steps:

```sh
npm install
cargo run dev
```

## Releases

Releases are generated automatically via Github actions, push to the `release` branch and up the `src-tauri/Cargo.toml` version.
