// Handle sending to ourbackend
import { invoke } from "@tauri-apps/api";
import { get } from 'svelte/store';
import { shiftlight, form_content } from "./Store";

export async function get_serial_ports() {
  return await invoke("find_available_ports")
    // `invoke` returns a Promise
    .then((response: any) => {
      return response;
    })
    .catch((error) => {
      throw error.message;
    });
}

export async function submit_config() {
  let current_config = get(form_content);
  let config = [];
  for (const key in current_config) {
    config.push(key + " " + current_config[key] + "\n");
  }

  // Write each of the values of our current form store to Serial.
  return await invoke("write_config", {
    portName: get(shiftlight).selected_port.port_name,
    config: config,
  })
    .then((responses: any) => {
      return responses;
    })
    .catch((error) => {
      throw error.message;
    });
}
