export type MessageHandler = (
  message: SafeAny,
  port: chrome.runtime.Port
) => void;

// interface ExtendedPort extends chrome.runtime.Port {
//   lastHeartbeat?: number;
// }

export class PortMessageManager {
  private ports: Map<string, chrome.runtime.Port> = new Map();
  private messageHandlers: Map<string, MessageHandler> = new Map();

  constructor(private _name: string) {}

  public connect(port: chrome.runtime.Port) {
    this._setupPort(port);
    return port;
  }

  private _setupPort(port: chrome.runtime.Port) {
    const portName = port.sender?.origin || this._name;

    this.ports.set(portName, port);

    port.onMessage.addListener(({ type, data }) => {
      if (!type) {
        return; // ignore dev server heartbeats
      }

      // if (type === 'HEARTBEAT') {
      //   port['lastHeartbeat'] = Date.now();
      //   return;
      // }

      const handler = this.messageHandlers.get(type);

      if (handler) {
        // TODO: check this
        handler(data, port);
      } else {
        console.warn(
          `Elytro: port ${portName} has no handler for message type: ${type}`
        );
      }
    });

    port.onDisconnect.addListener(() => {
      this.ports.delete(portName);
    });
  }

  public sendMessage(
    type: string,
    data: SafeAny,
    portName: string = this._name
  ) {
    const port = this.ports.get(portName); // ?? this.ports.values().next().value;

    if (port) {
      port.postMessage({ type, data });
    } else {
      console.error(`Elytro: No port found for name: ${portName}`);
    }
  }

  public onMessage(type: string, handler: MessageHandler) {
    this.messageHandlers.set(type, handler);
  }

  public dispose() {
    this.ports.forEach((port) => {
      port.disconnect();
    });

    this.messageHandlers.clear();
    this.ports.clear();
  }
}
