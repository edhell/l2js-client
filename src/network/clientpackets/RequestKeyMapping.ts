import GameServerPacket from "./GameServerPacket";

export default class RequestKeyMapping extends GameServerPacket {
  write(): void {
    // ⚠️ TODO: Verify exact opcode for Protocol 746
    this.writeH(0x21d0);
    this.writeC(0);
  }
}
