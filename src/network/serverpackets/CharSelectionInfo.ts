import GameClientPacket from "./GameClientPacket";
import GameServerPacket from "../clientpackets/GameServerPacket";
import CharacterSelect from "../clientpackets/CharacterSelect";
import L2User from "../../entities/L2User";
import L2ObjectCollection from "../../entities/L2ObjectCollection";

export default class CharSelectionInfo extends GameClientPacket {
  // @Override
  readImpl(): boolean {
    const _id = this.readC();
    const _characterPackagesSize = this.readD();

    // Server format differs from the original l2js-client schema.
    // Skip the rest to avoid underflow and allow the flow to continue.
    try {
      const remaining = this._buffer.byteLength - this._offset;
      if (remaining > 0) {
        this.readB(remaining);
      }
    } catch (e) {}

    return true;
  }

  // @Override
  run(): void {
    // no-op
  }
}
