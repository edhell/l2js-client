import GameServerPacket from "./GameServerPacket";

export default class Appearing extends GameServerPacket {
  write(): void {
    this.writeC(0x30); // Protocol 746 opcode
  }
}
