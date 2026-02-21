import MMOSession from "../../mmocore/MMOSession";
import GameServerPacket from "./GameServerPacket";

export default class AuthLogin extends GameServerPacket {
  private _session: MMOSession;

  constructor(session: MMOSession) {
    super();
    this._session = session;
  }

  write(): void {
    // Server expects AuthLogin on opcode 0x08 in CONNECTED state
    this.writeC(0x08);
    this.writeS(this._session.username);
    this.writeD(this._session.playOk2);
    this.writeD(this._session.playOk1);
    this.writeD(this._session.loginOk1);
    this.writeD(this._session.loginOk2);
  }
}
