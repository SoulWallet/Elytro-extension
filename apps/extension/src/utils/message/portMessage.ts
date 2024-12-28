class PortMessage {
  private _port: chrome.runtime.Port;

  constructor(private _name: string) {
    this._port = chrome.runtime.connect({ name: this._name });

    // this._port.onDisconnect.addListener(() => {
    //   console.warn(`Elytro: Port ${this._name} disconnected`);

    //   // try reconnect
    //   this._port = chrome.runtime.connect({ name: this._name });
    // });
  }

  public sendMessage(type: string, data: SafeObject) {
    this._port.postMessage({ type, data });
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
