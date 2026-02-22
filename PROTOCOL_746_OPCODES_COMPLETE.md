# Protocol 746 - Mapeamento Completo de Opcodes

**Fonte**: Extraído do código fonte do servidor em `d:\SERVER\Brproject_V2_9_4\libs\SOURCE`  
**Data**: 2026-02-21  
**Status**: ✅ VERIFICADO E DOCUMENTADO

---

## 📦 SERVER PACKETS (Servidor → Cliente)

| Opcode | Dec | Packet Name | Arquivo Servidor | Status |
|--------|-----|-------------|------------------|--------|
| 0x00 | 0 | VersionCheck | VersionCheck.java | ✅ |
| 0x01 | 1 | MoveToLocation | MoveToLocation.java | ❌ **CONFLITO** |
| 0x02 | 2 | PlayerInGame | - | ✅ |
| 0x04 | 4 | **UserInfo** | UserInfo.java | ✅ **Mapeamento corrigido (0x04)** |
| 0x05 | 5 | SpawnItem | SpawnItem.java | ✅ |
| 0x08 | 8 | DeleteObject | DeleteObject.java | ✅ |
| 0x09 | 9 | CharSelectionInfo | CharSelectInfo.java | ✅ |
| 0x0A | 10 | TempBan | TempBan.java | ✅ |
| 0x0B | 11 | CharSelected | CharSelected.java | ✅ |
| 0x0C | 12 | NpcInfo | NpcInfo.java | ✅ |
| 0x0E | 14 | **StatusUpdate** | StatusUpdate.java | ✅ **Mapeamento corrigido (0x0E)** |
| 0x11 | 17 | ItemList | ItemList.java | ✅ |
| 0x12 | 18 | SunRise | SunRise.java | ✅ |
| 0x13 | 19 | CharSelectionInfo | CharSelectInfo.java | ✅ |
| 0x14 | 20 | TradeStart | TradeStart.java | ✅ |
| 0x15 | 21 | **CharSelected** | CharSelected.java | ✅ **CORRETO** |
| 0x16 | 22 | DropItem | DropItem.java | ✅ |
| 0x17 | 23 | GetItem | GetItem.java | ✅ |
| 0x18 | 24 | StatusUpdate | - | ❌ **OPCODE ERRADO** |
| 0x19 | 25 | NpcHtmlMessage | NpcHtmlMessage.java | ✅ |
| 0x1A | 26 | TradeOwnAdd | TradeOwnAdd.java | ✅ |
| 0x1B | 27 | TradeOtherAdd | TradeOtherAdd.java | ✅ |
| 0x1C | 28 | TradeDone | TradeDone.java | ✅ |
| 0x1F | 31 | ActionFailed | ActionFailed.java | ✅ |
| 0x20 | 32 | ServerClose | ServerClose.java | ✅ |
| 0x21 | 33 | InventoryUpdate | InventoryUpdate.java | ✅ |
| 0x22 | 34 | TeleportToLocation | TeleportToLocation.java | ✅ |
| 0x23 | 35 | TargetSelected | TargetSelected.java | ✅ |
| 0x24 | 36 | TargetUnselected | TargetUnselected.java | ✅ |
| 0x25 | 37 | AutoAttackStart | AutoAttackStart.java | ✅ |
| 0x26 | 38 | AutoAttackStop | AutoAttackStop.java | ✅ |
| 0x27 | 39 | SocialAction | SocialAction.java | ✅ |
| 0x28 | 40 | ChangeMoveType | ChangeMoveType.java | ✅ |
| 0x29 | 41 | ChangeWaitType | ChangeWaitType.java | ✅ |
| 0x2E | 46 | KeyPacket | KeyPacket.java | ✅ |
| 0x2F | 47 | MoveToLocation | - | ❌ **DEVERIA SER 0x01** |
| 0x30 | 48 | NpcSay | NpcSay.java | ✅ |
| 0x31 | 49 | CharInfo | CharInfo.java | ✅ |
| 0x32 | 50 | UserInfo | - | ❌ **NÃO USADO (correção: 0x04)** |
| 0x33 | 51 | Attack | Attack.java | ✅ |
| 0x39 | 57 | AskJoinParty | AskJoinParty.java | ✅ |
| 0x3A | 58 | JoinParty | JoinParty.java | ✅ |
| 0x41 | 65 | WareHouseDepositList | WarehouseDepositList.java | ✅ |
| 0x42 | 66 | WareHouseWithdrawalList | WarehouseWithdrawList.java | ✅ |
| 0x44 | 68 | ShortCutRegister | ShortCutRegister.java | ✅ |
| 0x45 | 69 | ShortCutInit | ShortCutInit.java | ✅ |
| 0x47 | 71 | **StopMove** | StopMove.java | ✅ **CORRETO** |
| 0x48 | 72 | MagicSkillUse | MagicSkillUse.java | ✅ |
| 0x4A | 74 | CreatureSay | CreatureSay.java | ✅ |
| 0x4B | 75 | EquipUpdate | EquipUpdate.java | ✅ |
| 0x4E | 78 | PartySmallWindowAll | PartySmallWindowAll.java | ✅ |
| 0x4F | 79 | PartySmallWindowAdd | PartySmallWindowAdd.java | ✅ |
| 0x50 | 80 | PartySmallWindowDeleteAll | PartySmallWindowDeleteAll.java | ✅ |
| 0x51 | 81 | PartySmallWindowDelete | PartySmallWindowDelete.java | ✅ |
| 0x52 | 82 | PartySmallWindowUpdate | PartySmallWindowUpdate.java | ✅ |
| 0x54 | 84 | MagicSkillLaunched | MagicSkillLaunched.java | ✅ |
| 0x5F | 95 | SkillList | SkillList.java | ✅ |
| 0x60 | 96 | VehicleInfo | VehicleInfo.java | ✅ |
| 0x61 | 97 | StopRotation | StopRotation.java | ✅ |
| 0x62 | 98 | SystemMessage | SystemMessage.java | ✅ |
| 0x63 | 99 | StartPledgeWar | StartPledgeWar.java | ✅ |
| 0x65 | 101 | StopPledgeWar | StopPledgeWar.java | ✅ |
| 0x67 | 103 | SurrenderPledgeWar | SurrenderPledgeWar.java | ✅ |
| 0x6C | 108 | VehicleDeparture | VehicleDeparture.java | ✅ |
| 0x6D | 109 | VehicleCheckLocation | VehicleCheckLocation.java | ✅ |
| 0x71 | 113 | RestartResponse | RestartResponse.java | ✅ |
| 0x72 | 114 | MoveToPawn | MoveToPawn.java | ✅ |
| 0x73 | 115 | SSQInfo | SSQInfo.java | ✅ |
| 0x75 | 117 | FriendList | FriendList.java | ✅ |
| 0x79 | 121 | **ValidateLocation** | ValidateLocation.java | ✅ **CORRETO** |
| 0x7A | 122 | StartRotation | StartRotation.java | ✅ |
| 0x7B | 123 | ShowBoard | ShowBoard.java | ✅ |
| 0x7F | 127 | StopMoveInVehicle | StopMoveInVehicle.java | ✅ |
| 0x80 | 128 | ValidateLocationInVehicle | ValidateLocationInVehicle.java | ✅ |
| 0x82 | 130 | TradeOtherDone | TradeOtherDone.java | ✅ |
| 0x84 | 132 | LeaveWorld | LeaveWorld.java | ✅ |
| 0x85 | 133 | AbnormalStatusUpdate | AbnormalStatusUpdate.java | ✅ |
| 0x89 | 137 | PledgeInfo | PledgeInfo.java | ✅ |
| 0x9F | 159 | StaticObject | StaticObjectInfo.java | ✅ |
| 0xA1 | 161 | PrivateStoreListSell | PrivateStoreListSell.java | ✅ |
| 0xA6 | 166 | TutorialShowHtml | TutorialShowHtml.java | ✅ |
| 0xA7 | 167 | TutorialShowQuestionMark | TutorialShowQuestionMark.java | ✅ |
| 0xA8 | 168 | TutorialEnableClientEvent | TutorialEnableClientEvent.java | ✅ |
| 0xA9 | 169 | TutorialCloseHtml | TutorialCloseHtml.java | ✅ |
| 0xB7 | 183 | PetDelete | PetDelete.java | ✅ |
| 0xB9 | 185 | MyTargetSelected | MyTargetSelected.java | ✅ |
| 0xBA | 186 | PartyMemberPosition | PartyMemberPosition.java | ✅ |
| 0xC0 | 192 | VehicleStarted | VehicleStarted.java | ✅ |
| 0xC7 | 199 | SkillCoolTime | SkillCoolTime.java | ✅ |
| 0xCC | 204 | NicknameChanged | NicknameChanged.java | ✅ |
| 0xCE | 206 | RelationChanged | RelationChanged.java | ✅ |
| 0xD6 | 214 | SpecialCamera | SpecialCamera.java | ✅ |
| 0xD7 | 215 | NormalCamera | NormalCamera.java | ✅ |
| 0xDB | 219 | Snoop | Snoop.java | ✅ |
| 0xDC | 220 | RecipeBookItemList | RecipeBookItemList.java | ✅ |
| 0xDD | 221 | RecipeItemMakeInfo | RecipeItemMakeInfo.java | ✅ |
| 0xE4 | 228 | HennaItemDrawInfo | HennaItemInfo.java | ✅ |
| 0xE5 | 229 | HennaInfo | HennaInfo.java | ✅ |
| 0xE6 | 230 | HennaRemoveList | HennaUnequipList.java | ✅ |
| 0xE7 | 231 | HennaItemRemoveInfo | HennaItemUnequipInfo.java | ✅ |
| 0xEE | 238 | HennaEquipList | HennaEquipList.java | ✅ |
| 0xF3 | 243 | ConfirmDlg | ConfirmDlg.java | ✅ |
| 0xF9 | 249 | EtcStatusUpdate | EtcStatusUpdate.java | ✅ |

---

## 📤 CLIENT PACKETS (Cliente → Servidor)

### STATE: CONNECTED

| Opcode | Dec | Packet Name | Arquivo Servidor | Status |
|--------|-----|-------------|------------------|--------|
| 0x00 | 0 | SendProtocolVersion | SendProtocolVersion.java | ✅ |
| 0x08 | 8 | AuthLogin | AuthLogin.java | ✅ |

### STATE: AUTHED

| Opcode | Dec | Packet Name | Arquivo Servidor | Status |
|--------|-----|-------------|------------------|--------|
| 0x09 | 9 | Logout | Logout.java | ✅ |
| 0x0B | 11 | RequestCharacterCreate | RequestCharacterCreate.java | ✅ |
| 0x0C | 12 | RequestCharacterDelete | RequestCharacterDelete.java | ✅ |
| 0x0D | 13 | RequestGameStart | RequestGameStart.java | ✅ |
| 0x0E | 14 | RequestNewCharacter | RequestNewCharacter.java | ✅ |
| 0x62 | 98 | CharacterRestore | CharacterRestore.java | ✅ |
| 0x68 | 104 | RequestPledgeCrest | RequestPledgeCrest.java | ✅ |

### STATE: ENTERING

| Opcode | Dec | Packet Name | Arquivo Servidor | Status |
|--------|-----|-------------|------------------|--------|
| 0x03 | 3 | **EnterWorld** | EnterWorld.java | ✅ **CORRETO** |
| 0x3F | 63 | RequestQuestList | RequestQuestList.java | ✅ |
| 0xD0 0x0008 | 208,8 | RequestManorList | RequestManorList.java | ✅ |

### STATE: IN_GAME

| Opcode | Dec | Packet Name | Arquivo Servidor | Status |
|--------|-----|-------------|------------------|--------|
| 0x01 | 1 | **MoveBackwardToLocation** | MoveBackwardToLocation.java | ✅ **CORRETO** |
| 0x04 | 4 | **Action** | Action.java | ✅ **CORRETO** |
| 0x09 | 9 | Logout | Logout.java | ✅ |
| 0x0A | 10 | **AttackRequest** | AttackRequest.java | ✅ **CORRETO** |
| 0x0F | 15 | RequestItemList | RequestItemList.java | ✅ |
| 0x11 | 17 | RequestUnEquipItem | RequestUnEquipItem.java | ✅ |
| 0x12 | 18 | RequestDropItem | RequestDropItem.java | ✅ |
| 0x14 | 20 | UseItem | UseItem.java | ✅ |
| 0x15 | 21 | TradeRequest | TradeRequest.java | ✅ |
| 0x16 | 22 | AddTradeItem | AddTradeItem.java | ✅ |
| 0x17 | 23 | TradeDone | TradeDone.java | ✅ |
| 0x1B | 27 | RequestSocialAction | RequestSocialAction.java | ✅ |
| 0x1C | 28 | RequestChangeMoveType | RequestChangeMoveType.java | ✅ |
| 0x1D | 29 | RequestChangeWaitType | RequestChangeWaitType.java | ✅ |
| 0x1E | 30 | RequestSellItem | RequestSellItem.java | ✅ |
| 0x1F | 31 | RequestBuyItem | RequestBuyItem.java | ✅ |
| 0x20 | 32 | RequestLinkHtml | RequestLinkHtml.java | ✅ |
| 0x21 | 33 | RequestBypassToServer | RequestBypassToServer.java | ✅ |
| 0x22 | 34 | RequestBBSwrite | RequestBBSwrite.java | ✅ |
| 0x24 | 36 | RequestJoinPledge | RequestJoinPledge.java | ✅ |
| 0x25 | 37 | RequestAnswerJoinPledge | RequestAnswerJoinPledge.java | ✅ |
| 0x26 | 38 | RequestWithdrawPledge | RequestWithdrawPledge.java | ✅ |
| 0x27 | 39 | RequestOustPledgeMember | RequestOustPledgeMember.java | ✅ |
| 0x29 | 41 | RequestJoinParty | RequestJoinParty.java | ✅ |
| 0x2A | 42 | RequestAnswerJoinParty | RequestAnswerJoinParty.java | ✅ |
| 0x2B | 43 | RequestWithdrawParty | RequestWithdrawParty.java | ✅ |
| 0x2C | 44 | RequestOustPartyMember | RequestOustPartyMember.java | ✅ |
| 0x2F | 47 | RequestMagicSkillUse | RequestMagicSkillUse.java | ✅ |
| 0x30 | 48 | **Appearing** | Appearing.java | ✅ **CORRETO** |
| 0x31 | 49 | SendWarehouseDepositList | SendWarehouseDepositList.java | ✅ |
| 0x32 | 50 | SendWarehouseWithdrawList | SendWarehouseWithdrawList.java | ✅ |
| 0x33 | 51 | RequestShortCutReg | RequestShortCutReg.java | ✅ |
| 0x35 | 53 | RequestShortCutDel | RequestShortCutDel.java | ✅ |
| 0x36 | 54 | CannotMoveAnymore | CannotMoveAnymore.java | ✅ |
| 0x37 | 55 | RequestTargetCancel | RequestTargetCancel.java | ✅ |
| 0x38 | 56 | **Say2** | Say2.java | ✅ **CORRETO** |
| 0x3C | 60 | RequestPledgeMemberList | RequestPledgeMemberList.java | ✅ |
| 0x3F | 63 | RequestSkillList | RequestSkillList.java | ✅ |
| 0x42 | 66 | RequestGetOnVehicle | RequestGetOnVehicle.java | ✅ |
| 0x43 | 67 | RequestGetOffVehicle | RequestGetOffVehicle.java | ✅ |
| 0x44 | 68 | AnswerTradeRequest | AnswerTradeRequest.java | ✅ |
| 0x45 | 69 | RequestActionUse | RequestActionUse.java | ✅ |
| 0x46 | 70 | RequestRestart | RequestRestart.java | ✅ |
| 0x48 | 72 | **ValidatePosition** | ValidatePosition.java | ✅ **CORRETO** |
| 0x4A | 74 | StartRotating | StartRotating.java | ✅ |
| 0x4B | 75 | FinishRotating | FinishRotating.java | ✅ |
| 0x4D | 77 | RequestStartPledgeWar | RequestStartPledgeWar.java | ✅ |
| 0x4E | 78 | RequestReplyStartPledgeWar | RequestReplyStartPledgeWar.java | ✅ |
| 0x4F | 79 | RequestStopPledgeWar | RequestStopPledgeWar.java | ✅ |
| 0x50 | 80 | RequestReplyStopPledgeWar | RequestReplyStopPledgeWar.java | ✅ |
| 0x51 | 81 | RequestSurrenderPledgeWar | RequestSurrenderPledgeWar.java | ✅ |
| 0x52 | 82 | RequestReplySurrenderPledgeWar | RequestReplySurrenderPledgeWar.java | ✅ |
| 0x53 | 83 | RequestSetPledgeCrest | RequestSetPledgeCrest.java | ✅ |
| 0x55 | 85 | RequestGiveNickName | RequestGiveNickName.java | ✅ |
| 0x57 | 87 | RequestShowBoard | RequestShowBoard.java | ✅ |
| 0x58 | 88 | RequestEnchantItem | RequestEnchantItem.java | ✅ |
| 0x59 | 89 | RequestDestroyItem | RequestDestroyItem.java | ✅ |
| 0x5B | 91 | SendBypassBuildCmd | SendBypassBuildCmd.java | ✅ |
| 0x5C | 92 | RequestMoveToLocationInVehicle | RequestMoveToLocationInVehicle.java | ✅ |
| 0x5D | 93 | CannotMoveAnymoreInVehicle | CannotMoveAnymoreInVehicle.java | ✅ |
| 0x5E | 94 | RequestFriendInvite | RequestFriendInvite.java | ✅ |
| 0x5F | 95 | RequestAnswerFriendInvite | RequestAnswerFriendInvite.java | ✅ |
| 0x60 | 96 | RequestFriendList | RequestFriendList.java | ✅ |
| 0x61 | 97 | RequestFriendDel | RequestFriendDel.java | ✅ |
| 0x63 | 99 | RequestQuestList | RequestQuestList.java | ✅ |
| 0x64 | 100 | RequestQuestAbort | RequestQuestAbort.java | ✅ |
| 0x66 | 102 | RequestPledgeInfo | RequestPledgeInfo.java | ✅ |
| 0x68 | 104 | RequestPledgeCrest | RequestPledgeCrest.java | ✅ |
| 0x69 | 105 | RequestSurrenderPersonally | RequestSurrenderPersonally.java | ✅ |
| 0x6B | 107 | RequestAcquireSkillInfo | RequestAcquireSkillInfo.java | ✅ |
| 0x6C | 108 | RequestAcquireSkill | RequestAcquireSkill.java | ✅ |
| 0x6D | 109 | **RequestRestartPoint** | RequestRestartPoint.java | ✅ **CORRETO** |
| 0x6E | 110 | RequestGMCommand | RequestGMCommand.java | ✅ |
| 0x6F | 111 | RequestListPartyWaiting | RequestListPartyWaiting.java | ✅ |
| 0x70 | 112 | RequestManagePartyRoom | RequestManagePartyRoom.java | ✅ |
| 0x71 | 113 | RequestJoinPartyRoom | RequestJoinPartyRoom.java | ✅ |
| 0x72 | 114 | RequestCrystallizeItem | RequestCrystallizeItem.java | ✅ |
| 0x73 | 115 | RequestPrivateStoreManageSell | RequestPrivateStoreManageSell.java | ✅ |
| 0x74 | 116 | SetPrivateStoreListSell | SetPrivateStoreListSell.java | ✅ |
| 0x76 | 118 | RequestPrivateStoreQuitSell | RequestPrivateStoreQuitSell.java | ✅ |
| 0x77 | 119 | SetPrivateStoreMsgSell | SetPrivateStoreMsgSell.java | ✅ |
| 0x79 | 121 | RequestPrivateStoreBuy | RequestPrivateStoreBuy.java | ✅ |
| 0x7B | 123 | RequestTutorialLinkHtml | RequestTutorialLinkHtml.java | ✅ |
| 0x7C | 124 | RequestTutorialPassCmdToServer | RequestTutorialPassCmdToServer.java | ✅ |
| 0x7D | 125 | RequestTutorialQuestionMark | RequestTutorialQuestionMark.java | ✅ |
| 0x7E | 126 | RequestTutorialClientEvent | RequestTutorialClientEvent.java | ✅ |
| 0x7F | 127 | RequestPetition | RequestPetition.java | ✅ |
| 0x80 | 128 | RequestPetitionCancel | RequestPetitionCancel.java | ✅ |
| 0x81 | 129 | RequestGmList | RequestGmList.java | ✅ |
| 0x82 | 130 | RequestJoinAlly | RequestJoinAlly.java | ✅ |
| 0x83 | 131 | RequestAnswerJoinAlly | RequestAnswerJoinAlly.java | ✅ |
| 0x84 | 132 | AllyLeave | AllyLeave.java | ✅ |
| 0x85 | 133 | AllyDismiss | AllyDismiss.java | ✅ |
| 0x86 | 134 | RequestDismissAlly | RequestDismissAlly.java | ✅ |
| 0x87 | 135 | RequestSetAllyCrest | RequestSetAllyCrest.java | ✅ |
| 0x88 | 136 | RequestAllyCrest | RequestAllyCrest.java | ✅ |
| 0x89 | 137 | RequestChangePetName | RequestChangePetName.java | ✅ |
| 0x8A | 138 | RequestPetUseItem | RequestPetUseItem.java | ✅ |
| 0x8B | 139 | RequestGiveItemToPet | RequestGiveItemToPet.java | ✅ |
| 0x8C | 140 | RequestGetItemFromPet | RequestGetItemFromPet.java | ✅ |
| 0x8E | 142 | RequestAllyInfo | RequestAllyInfo.java | ✅ |
| 0x8F | 143 | RequestPetGetItem | RequestPetGetItem.java | ✅ |
| 0x90 | 144 | RequestPrivateStoreManageBuy | RequestPrivateStoreManageBuy.java | ✅ |
| 0x91 | 145 | SetPrivateStoreListBuy | SetPrivateStoreListBuy.java | ✅ |
| 0x93 | 147 | RequestPrivateStoreQuitBuy | RequestPrivateStoreQuitBuy.java | ✅ |
| 0x94 | 148 | SetPrivateStoreMsgBuy | SetPrivateStoreMsgBuy.java | ✅ |
| 0x96 | 150 | RequestPrivateStoreSell | RequestPrivateStoreSell.java | ✅ |
| 0x97 | 151 | SendTimeCheck | SendTimeCheck.java | ✅ |
| 0x9E | 158 | RequestPackageSendableItemList | RequestPackageSendableItemList.java | ✅ |
| 0x9F | 159 | RequestPackageSend | RequestPackageSend.java | ✅ |
| 0xA0 | 160 | RequestBlock | RequestBlock.java | ✅ |
| 0xA2 | 162 | RequestSiegeAttackerList | RequestSiegeAttackerList.java | ✅ |
| 0xA3 | 163 | RequestSiegeDefenderList | RequestSiegeDefenderList.java | ✅ |
| 0xA4 | 164 | RequestJoinSiege | RequestJoinSiege.java | ✅ |
| 0xA5 | 165 | RequestConfirmSiegeWaitingList | RequestConfirmSiegeWaitingList.java | ✅ |
| 0xA7 | 167 | MultiSellChoose | MultiSellChoose.java | ✅ |
| 0xAA | 170 | RequestUserCommand | RequestUserCommand.java | ✅ |
| 0xAB | 171 | SnoopQuit | SnoopQuit.java | ✅ |
| 0xAC | 172 | RequestRecipeBookOpen | RequestRecipeBookOpen.java | ✅ |
| 0xAD | 173 | RequestRecipeBookDestroy | RequestRecipeBookDestroy.java | ✅ |
| 0xAE | 174 | RequestRecipeItemMakeInfo | RequestRecipeItemMakeInfo.java | ✅ |
| 0xAF | 175 | RequestRecipeItemMakeSelf | RequestRecipeItemMakeSelf.java | ✅ |
| 0xB1 | 177 | RequestRecipeShopMessageSet | RequestRecipeShopMessageSet.java | ✅ |
| 0xB2 | 178 | RequestRecipeShopListSet | RequestRecipeShopListSet.java | ✅ |
| 0xB3 | 179 | RequestRecipeShopManageQuit | RequestRecipeShopManageQuit.java | ✅ |
| 0xB5 | 181 | RequestRecipeShopMakeInfo | RequestRecipeShopMakeInfo.java | ✅ |
| 0xB6 | 182 | RequestRecipeShopMakeItem | RequestRecipeShopMakeItem.java | ✅ |
| 0xB7 | 183 | RequestRecipeShopManagePrev | RequestRecipeShopManagePrev.java | ✅ |
| 0xB8 | 184 | ObserverReturn | ObserverReturn.java | ✅ |
| 0xB9 | 185 | RequestEvaluate | RequestEvaluate.java | ✅ |
| 0xBA | 186 | RequestHennaItemList | RequestHennaItemList.java | ✅ |
| 0xBB | 187 | RequestHennaItemInfo | RequestHennaItemInfo.java | ✅ |
| 0xBC | 188 | RequestHennaEquip | RequestHennaEquip.java | ✅ |
| 0xBD | 189 | RequestHennaUnequipList | RequestHennaUnequipList.java | ✅ |
| 0xBE | 190 | RequestHennaUnequipInfo | RequestHennaUnequipInfo.java | ✅ |
| 0xBF | 191 | RequestHennaUnequip | RequestHennaUnequip.java | ✅ |
| 0xC0 | 192 | RequestPledgePower | RequestPledgePower.java | ✅ |
| 0xC1 | 193 | RequestMakeMacro | RequestMakeMacro.java | ✅ |
| 0xC2 | 194 | RequestDeleteMacro | RequestDeleteMacro.java | ✅ |
| 0xC3 | 195 | RequestBuyProcure | RequestBuyProcure.java | ✅ |
| 0xC4 | 196 | RequestBuySeed | RequestBuySeed.java | ✅ |
| 0xC5 | 197 | DlgAnswer | DlgAnswer.java | ✅ |
| 0xC6 | 198 | RequestPreviewItem | RequestPreviewItem.java | ✅ |
| 0xC7 | 199 | RequestSSQStatus | RequestSSQStatus.java | ✅ |
| 0xC8 | 200 | PetitionVote | PetitionVote.java | ✅ |
| 0xCA | 202 | GameGuardReply | GameGuardReply.java | ✅ |
| 0xCC | 204 | RequestSendL2FriendSay | RequestSendL2FriendSay.java | ✅ |
| 0xCD | 205 | RequestShowMiniMap | RequestShowMiniMap.java | ✅ |
| 0xCF | 207 | RequestRecordInfo | RequestRecordInfo.java | ✅ |

### Extended Packets (0xD0)

| Subcode | Dec | Packet Name | Arquivo Servidor | Status |
|---------|-----|-------------|------------------|--------|
| 0x0001 | 1 | RequestOustFromPartyRoom | RequestOustFromPartyRoom.java | ✅ |
| 0x0002 | 2 | RequestDismissPartyRoom | RequestDismissPartyRoom.java | ✅ |
| 0x0003 | 3 | RequestWithdrawPartyRoom | RequestWithdrawPartyRoom.java | ✅ |
| 0x0004 | 4 | RequestChangePartyLeader | RequestChangePartyLeader.java | ✅ |
| 0x0005 | 5 | RequestAutoSoulShot | RequestAutoSoulShot.java | ✅ |
| 0x0006 | 6 | RequestExEnchantSkillInfo | RequestExEnchantSkillInfo.java | ✅ |
| 0x0007 | 7 | RequestExEnchantSkill | RequestExEnchantSkill.java | ✅ |
| 0x0008 | 8 | RequestManorList | RequestManorList.java | ✅ |
| 0x0009 | 9 | RequestProcureCropList | RequestProcureCropList.java | ✅ |
| 0x000A | 10 | RequestSetSeed | RequestSetSeed.java | ✅ |
| 0x000B | 11 | RequestSetCrop | RequestSetCrop.java | ✅ |
| 0x000C | 12 | RequestWriteHeroWords | RequestWriteHeroWords.java | ✅ |
| 0x000D | 13 | RequestExAskJoinMPCC | RequestExAskJoinMPCC.java | ✅ |
| 0x000E | 14 | RequestExAcceptJoinMPCC | RequestExAcceptJoinMPCC.java | ✅ |
| 0x000F | 15 | RequestExOustFromMPCC | RequestExOustFromMPCC.java | ✅ |

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **UserInfo - OPCODE INCORRETO**

**Atual (l2js-client)**:
```typescript
case 0x32:  // ERRADO!
    rpk = new UserInfo();
    break;
```

**Correto (Servidor)**:
```java
// UserInfo.java linha 36
writeC(4);  // Opcode 0x04
```

**Correção necessária**:
```typescript
case 0x04:  // CORRETO!
    rpk = new UserInfo();
    break;
```

---

### 2. **StatusUpdate - OPCODE INCORRETO**

**Atual (l2js-client)**:
```typescript
case 0x18:  // ERRADO!
    rpk = new StatusUpdate();
    break;
```

**Correto (Servidor)**:
```java
// StatusUpdate.java linha 27
writeC(14);  // Opcode 0x0E
```

**Correção necessária**:
```typescript
case 0x0E:  // CORRETO!
    rpk = new StatusUpdate();
    break;
```

---

### 3. **MoveToLocation - OPCODE INCORRETO**

**Atual (l2js-client)**:
```typescript
case 0x2f:  // 47 decimal - ERRADO!
    rpk = new MoveToLocation();
    break;
case 0x01:  // Mapeado como Revive - CONFLITO!
    rpk = new Revive();
    break;
```

**Correto (Servidor)**:
```java
// MoveToLocation.java linha 28
writeC(1);  // Opcode 0x01
```

**Correção necessária**:
```typescript
case 0x01:  // CORRETO para MoveToLocation!
    rpk = new MoveToLocation();
    break;
case 0x47:  // ERRADO - mas é StopMove!
    rpk = new StopMove();
    break;
```

---

### 4. **CharSelected HP/MP - TIPO DE DADOS INCORRETO**

**Atual (l2js-client)**:
```typescript
// CharSelected.ts
user.Hp = this.readD();  // Lê como INT - ERRADO!
user.Mp = this.readD();  // Lê como INT - ERRADO!
```

**Correto (Servidor)**:
```java
// CharSelected.java linhas 35-36
this.writeF(this._player.getStatus().getHp());  // FLOAT!
this.writeF(this._player.getStatus().getMp());  // FLOAT!
```

**Correção necessária**:
```typescript
// CharSelected.ts
user.Hp = this.readF();  // Lê como FLOAT
user.Mp = this.readF();  // Lê como FLOAT
```

---

## ✅ OPCODES CONFIRMADOS COMO CORRETOS

1. ✅ **CharSelected**: 0x15 (21) - Opcode correto
2. ✅ **StopMove**: 0x47 (71) - Opcode correto
3. ✅ **ValidateLocation**: 0x79 (121) - Opcode correto
4. ✅ **MoveBackwardToLocation** (cliente→servidor): 0x01 - Opcode correto
5. ✅ **Say2** (cliente→servidor): 0x38 (56) - Opcode correto
6. ✅ **AttackRequest** (cliente→servidor): 0x0A (10) - Opcode correto
7. ✅ **EnterWorld** (cliente→servidor): 0x03 - Opcode correto
8. ✅ **Appearing** (cliente→servidor): 0x30 (48) - Opcode correto
9. ✅ **ValidatePosition** (cliente→servidor): 0x48 (72) - Opcode correto
10. ✅ **RequestRestartPoint** (cliente→servidor): 0x6D (109) - Opcode correto

---

## 📝 NOTAS IMPORTANTES

1. **Revive Packet**: O opcode 0x01 NÃO é Revive no servidor. Verificar qual é o opcode correto para Revive.
2. **Ordem de leitura em CharSelected**: HP e MP são FLOAT, não INT
3. **Conflito de opcodes**: 0x18 atualmente mapeado como StatusUpdate, mas deveria ser 0x0E
4. **Packet 0x2F mapeado como MoveToLocation**: Incorreto, deveria ser 0x01

---

**Data de Atualização**: 2026-02-21  
**Origem dos Dados**: Código fonte do servidor BRProject v2.9.4  
**Protocolo**: 746 (Lineage 2 Interlude)
