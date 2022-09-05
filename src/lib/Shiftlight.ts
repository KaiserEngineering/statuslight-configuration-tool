import { invoke } from "@tauri-apps/api";
import { ShiftLightConfigs } from "./Config";

export class Port {
  port_name: string;
}

export class ShiftLight {
  port: Port;
  config_type: string;
  loaded_config: {};

  constructor() {
  }

  async load_current_config() {
    this.loaded_config = {};

    return await invoke("write", {
      portName: this.port.port_name,
      content: "VER\n",
    })
      .then(async (version: string) => {
        let keys = ShiftLightConfigs[version.replace("\n", "")];

        let new_config = {};
        for (let key in keys) {
          await invoke("write", {
            portName: this.port.port_name,
            content: key + "\n",
          }).then((res: string) => {
            new_config[key] = res.replace("\n", "");
          })
            .catch((error) => {
              throw error.message;
            });
        }
        this.loaded_config = new_config;
      })
      .catch((error) => {
        throw error.message;
      });
  }
}
