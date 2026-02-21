import GameServerPacket from "./GameServerPacket";

export default class Logout extends GameServerPacket {
  write(): void {
    this.writeC(0x09); // Protocol 746 opcode
  }
}
