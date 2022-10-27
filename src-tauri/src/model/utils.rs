// ! General utilities

use reqwest;

/*
Get the content from our public Git repo that contains
the latest firmware version's hex file and the change
log for the version.

This repo also contains info about updating Tauri app via
updaters.
*/
pub async fn get(url: String) -> Result<String, String> {
    match reqwest::get(url).await {
        Ok(res) => match res.text().await {
            Ok(res) => Ok(res),
            Err(e) => Err(e.to_string()),
        },
        Err(e) => Err(e.to_string()),
    }
}
