import { GlobalEvents } from "../../mmocore/EventEmitter";
import GameClientPacket from "./GameClientPacket";

export default class CreatureSay extends GameClientPacket {
  // @Override
  readImpl(): boolean {
    const _id = this.readC();
    const _objectId = this.readD();
    const _textType = this.readD();

    const _charName = this.readS();
    const _content = this.readS(); // Direct message content for Protocol 746

    GlobalEvents.fire("CreatureSay", {
      objectId: _objectId,
      type: _textType,
      charName: _charName,
      npcStringId: 0,
      messages: [_content], // Single message content
    });
    return true;
  }

  // @Override
  run(): void {
    // no-op
  }
}
