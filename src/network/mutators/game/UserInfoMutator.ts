import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import UserInfo from "../../incoming/game/UserInfo";
import Logger from "../../../mmocore/Logger";

const logger = Logger.getLogger("UserInfoMutator");

export default class UserInfoMutator extends IMMOClientMutator<
  GameClient,
  UserInfo
> {
  update(packet: UserInfo): void {
    logger.debug(`UserInfoMutator.update for ObjectId=${packet.User ? packet.User.ObjectId : 'N/A'}`);
    const user = this.Client.ActiveChar;
    if (!user) {
      this.Client.ActiveChar = packet.User;
    } else {
      // Replace the active char instance with the parsed User instance so
      // internal fields (like _level, _maxHp, _maxMp) set by setters are preserved.
      let eventHandlers = this.Client.ActiveChar._eventHandlers;
      this.Client.ActiveChar = packet.User;
      // Restore event handlers
      this.Client.ActiveChar._eventHandlers = eventHandlers;
    }

    if (!this.Client.CreaturesList.getEntryByObjectId(packet.User.ObjectId)) {
      this.Client.CreaturesList.add(this.Client.ActiveChar);
    }
    logger.debug(`ActiveChar after UserInfo: Name=${this.Client.ActiveChar ? this.Client.ActiveChar.Name : 'null'} Level=${this.Client.ActiveChar ? this.Client.ActiveChar.Level : 'undef'} MaxHp=${this.Client.ActiveChar ? this.Client.ActiveChar.MaxHp : 'undef'}`);
  }
}
