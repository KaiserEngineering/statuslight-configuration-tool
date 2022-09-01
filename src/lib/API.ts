// Handle sending to ourbackend
import { invoke } from "@tauri-apps/api";

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

export async function write_serial(port: string, content: string) {
  return await invoke("send_message", {
    portName: port,
    content: content,
  })
  .then((_response: any) => {
    return "Write successful!";
  })
  .catch((error) => {
    throw error.message;
  });
}
