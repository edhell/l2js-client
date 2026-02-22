import ICommand from "./ICommand";
import MMOClient from "../mmocore/MMOClient";
import Logger from "../mmocore/Logger";

export default abstract class AbstractGameCommand<T extends MMOClient = MMOClient> implements ICommand {
  protected logger: Logger = Logger.getLogger(this.constructor.name);

  private _client!: T;

  public get Client(): T {
    return this._client;
  }

  public set Client(value: T) {
    this._client = value;
  }

  // Convenience accessors used throughout commands
  public get GameClient(): any {
    return this._client as any;
  }

  public get LoginClient(): any {
    return this._client as any;
  }

  constructor(client?: T) {
    if (client) {
      this._client = client;
    }
  }

  // @Override
  abstract execute(...args: any[]): void;
}
