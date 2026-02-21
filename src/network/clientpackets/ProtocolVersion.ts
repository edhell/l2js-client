import GameServerPacket from "./GameServerPacket";

export default class ProtocolVersion extends GameServerPacket {
  private _protocolVersion = 746;  // Protocol 110 for Interlude Classic server

  write(): void {
    this.writeC(0x00);
    this.writeD(this._protocolVersion);
    // HWID protection block: 260 bytes + 3 strings (HDD/MAC/CPU)
    this.writeB(new Uint8Array(260));
    this.writeS("BOT-HWID-HD");
    this.writeS("BOT-HWID-MAC");
    this.writeS("BOT-HWID-CPU");
  }
}
