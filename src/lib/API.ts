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

export async function write_serial(content: string) {
  return await invoke("write", {
    portName: get(shiftlight).selected_port.port_name,
    content: "SHIFT\n",
  })
  .then((response: any) => {
    return response;
  })
  .catch((error) => {
    throw error.message;
  });
}

export async function submit_config() {
  // Write each of the values of our current form store to Serial.
  let resp = {
    error: [],
    success: []
  };

  for await (const entry of Object.entries(get(form_content)) ) {
    await write_serial(entry[0] + " " + entry[1])
    .then((res: any) => {
      resp.success.push(res);
    })
    .catch((error) => {
      resp.error.push(error);
    });
  }
  return resp;
}
