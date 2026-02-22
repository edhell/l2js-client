import IStream from "./IStream";
import MMOConfig from "./MMOConfig";
import IConnection from "./IConnection";
import SocketFactory from "../socket/SocketFactory";
import Logger from "./Logger";
import IProcessable from "./IProcessable";

export default class MMOConnection implements IConnection {
  protected logger: Logger = Logger.getLogger(this.constructor.name);

  private _client!: IProcessable;

  private _stream: IStream;

  constructor(config: MMOConfig, client: IProcessable) {
    this._stream = SocketFactory.getSocketAdapter(config);
    this._client = client;
  }

  connect(): Promise<void> {
    this.logger.debug("Connecting", this._stream.toString());
    return this._stream.connect().then(() => {
      this.logger.info("Connected", this._stream.toString());
      this.read();
    }).catch(() => {
      this.logger.error("Connection fail to ", this._stream.toString());
    });
  }

  async read(): Promise<void> {
    try {
      const data: Uint8Array = await this._stream.recv();
      if (data) {
        //this.logger.debug(`Read ${data.byteLength} bytes from stream`);
        this._client.process(data).catch((err) => {
          this.logger.error('Error processing data: ' + (err && err.toString ? err.toString() : err));
        });
      }
    } catch (err) {
      this.logger.error('Error reading from stream: ' + (err && err.toString ? err.toString() : err));
    }
    // continue reading
    this.read();
  }

  write(raw: Uint8Array): Promise<void> {
    return this._stream.send(raw);
  }

  close(): Promise<void> {
    return this._stream.close().then(() => {
      this.logger.info("Disconnected", this._stream.toString());
    });
  }
}
