import GameServerPacket from "./GameServerPacket";

export default class CharacterSelect extends GameServerPacket {
  constructor(public slot: number) {
    super();
  }

  write(): void {
    // Server expects RequestGameStart on opcode 0x0D
    this.writeC(0x0d);
    this.writeD(this.slot);
    this.writeH(0);
    this.writeD(0);
    this.writeD(0);
    this.writeD(0);
  }
}
