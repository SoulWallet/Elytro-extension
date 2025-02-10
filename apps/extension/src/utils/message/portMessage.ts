class PortMessage {
  private _port: chrome.runtime.Port;

  constructor(private _name: string) {
    this._port = chrome.runtime.connect({ name: this._name });
  }

  public sendMessage(type: string, data: SafeObject) {
    try {
      this._port.postMessage({ type, data });
    } catch {
      // TODO: check if we need to reconnect
      this._port = chrome.runtime.connect({ name: this._name });
    }
  }

  public onMessage(targetType: string, listener: (data: SafeObject) => void) {
    this._port.onMessage.addListener(({ type, data }) => {
      if (type === targetType) {
        listener(data);
      }
    });
  }
}

export default PortMessage;
