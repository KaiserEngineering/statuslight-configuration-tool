export class Port {
  port_name: string;
}

export class ShiftLight {
  selected_port: Port;
  ports: [Port];

  constructor() {
    this.selected_port = new Port();
  }
}
