import GameServerPacket from "./GameServerPacket";

export default class RequestManorList extends GameServerPacket {
  write(): void {
    this.writeH(0x08d0); // Protocol 746 opcode (was 0x01d0)
    this.writeC(0);
  }
}
