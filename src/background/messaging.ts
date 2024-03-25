import { v4 as uuidv4 } from "uuid";

export class Port {
  private port: chrome.runtime.Port;
  private connected: boolean;
  private sendWaitlist: { name; data; id }[];
  private responseListeners: {
    id: string;
    resolve: (value: unknown) => void;
  }[];
  private receivingListeners: {
    name: string;
    callback: (value: unknown) => any;
  }[];
  constructor(port?: chrome.runtime.Port) {
    this.port = port || chrome.runtime.connect();
    this.port.onDisconnect.addListener(() => {
      console.log("disconnected");
    });
    this.connected = !!port;
    this.sendWaitlist = [];
    this.responseListeners = [];
    this.receivingListeners = [];
    this.port.onMessage.addListener(async (message) => {
      if (message.type === "connect") {
        this.connected = true;
        for (const sendData of this.sendWaitlist) {
          this.port.postMessage(sendData);
        }
      }
      const { name, data, id } = message;
      const responseListener = this.responseListeners.find(
        (listener) => listener.id === id,
      );
      if (responseListener) {
        responseListener.resolve(data);
        return;
      }
      const reveivingListener = this.receivingListeners.find(
        (listener) => listener.name === name,
      );
      if (reveivingListener) {
        const data = await reveivingListener.callback(message.data);
        this.port.postMessage({ name, data, id });
      }
    });
  }

  send<R>(name: string, data?: any) {
    const id = uuidv4();
    const sendData = { name, data, id };
    if (this.connected) {
      this.port.postMessage(sendData);
    } else {
      this.sendWaitlist.push(sendData);
    }
    return new Promise((resolve: (value: R) => void) => {
      this.responseListeners.push({ id, resolve });
    });
  }

  onMessage(name, callback: (data: unknown) => any) {
    this.receivingListeners.push({ name, callback });
  }
}

export function onPortConnection(callback: (port: Port) => void) {
  chrome.runtime.onConnect.addListener((port) => {
    port.postMessage({ type: "connect" });
    callback(new Port(port));
  });
}
