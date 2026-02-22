import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import PartySpelled from "../../incoming/game/PartySpelled";

export default class PartySpelledMutator extends IMMOClientMutator<
  GameClient,
  PartySpelled
> {
  update(packet: PartySpelled): void {
    const creature = this.Client.PartyList.getEntryByObjectId(
      packet.PartyMemberObjectId
    );
    if (creature) {
      // Buffs is a simple array on party members; reset and push incoming buffs
      creature.Buffs = [];
      packet.PartyMemberBuffs.forEach((buff) => {
        creature.Buffs.push(buff);
      });

      this.fire("PartySpelled", { creature });
    }
  }
}
