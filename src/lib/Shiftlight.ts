import { invoke } from "@tauri-apps/api";
import { ShiftLightConfigs } from "./Config";

export class Port {
  port_name: string;
}

export class ShiftLight {
  port: Port;
  variant: String;
  loaded_config: {};

  constructor() {
  }

  // async load_current_config() {
  //   await invoke("write_from_new_handle", {
  //     portName: this.port.port_name,
  //     config: "VER\n",
  //   })
  //   .then((variant: any) => {
  //     let keys = ShiftLightConfigs["RPM"];

  //     await invoke("submit_config", {
  //       portName: this.port.port_name,
  //       config: "VER\n",
  //     })

  //     let new_config = {};
  //     for (let key in keys) {
  //       new_config[key] = 
  //     }

  //     this.loaded_config = "response";
  //   })
  //   .catch((error) => {
  //     throw error.message;
  //   });
  // }
}
