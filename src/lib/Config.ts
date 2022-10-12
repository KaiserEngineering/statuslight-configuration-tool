export const ShiftLightConfigs: any = {
  "RPM": {
    "Shift Point": {
      "code": "SHIFT",
      "type": "number",
    },
    "Acquisition Mode": {
      "code": "aquisition_mode",
      "type": [
        { "label": "OBDII_MODE", "value": "OBDII_MODE" },
        { "label": "CAN Bus Listen Mode", "value": "CAN Bus Listen Mode" },
        { "label": "Tachometer", "value": "Tachometer" }
      ]
    },
    "ecu_timeout": {
      "code": "ecu_timeout",
      "type": "number"
    },
    "ecu_tx_id": {
      "code": "ecu_tx_id",
      "type": "number"
    },
    "ecu_rx_id": {
      "code": "ecu_rx_id",
      "type": "number"
    },
    "uint32_t": {
      "code": "uint32_t",
      "type": "number"
    },
    "Animation Direction": {
      "code": "ANIMATION_DIRECTION",
      "type": [
        { "label": "ANIMATION_DIR_OUT_TO_IN", "value": "ANIMATION_DIR_OUT_TO_IN" }
      ]
    }
  },
  "Boost": {}
};
