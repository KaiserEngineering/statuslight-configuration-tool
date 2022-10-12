import { invoke } from "@tauri-apps/api";
import { ShiftLightConfigs } from "./Config";

export class Port {
  port_name: string;
  port_info: string;
}

export class ShiftLight {
  port: Port;
  config_type: string;
  loaded_config: {};

  constructor() {
  }

  async load_current_config() {
    await invoke("close_active_port", {})
      .catch((err) => {
        throw new err;
      });

    this.loaded_config = null;

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
            content: keys[key]["code"] + "\n",
          }).then((res: string) => {
            new_config[keys[key]["code"]] = res.replace("\n", "");
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
