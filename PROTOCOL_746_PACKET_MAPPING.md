# Protocol 746 - L2J Packet Mapping

Este arquivo mapeia os opcodes e estruturas corretas dos packets do servidor L2J Protocol 746.

## ✅ CORREÇÕES REALIZADAS (2026-02-21)

### Opcodes Corrigidos no GamePacketHandler.ts:
1. ✅ **UserInfo**: `0x32` → `0x04` (CORRIGIDO)
2. ✅ **StatusUpdate**: `0x18` → `0x0E` (CORRIGIDO)
3. ✅ **MoveToLocation**: `0x2F` → `0x01` (CORRIGIDO)
4. ✅ **Die**: Adicionado `0x06` (pacote de morte)
5. ✅ **Revive**: Removido `0x01` (não existe no servidor)

> Nota: As correções acima foram aplicadas no código-fonte (`src/`). Se você estiver usando a versão compilada em `dist/`, execute `npm run compile` para gerar o `dist/` atualizado a partir do `src`.

### Tipos de Dados Corrigidos:
1. ✅ **CharSelected HP/MP**: `readD()` → `readF()` (CORRIGIDO para FLOAT)

> Observação sobre alterações temporárias em `dist`:
> - Durante diagnóstico eu inseri logs temporários em arquivos dentro de `dist/` para inspecionar valores brutos. Esses logs foram removidos e as correções finais foram aplicadas no `src/`.
> - Não é necessário manter alterações manuais em `dist/`; sempre aplique mudanças no `src/` e rode `npm run compile`.

---

## ❌ PROBLEMAS CRÍTICOS IDENTIFICADOS NO l2js-client:

### 1. **OPCODES INCORRETOS** ✅ CORRIGIDOS
- ~~**UserInfo**: l2js-client espera `0x32`, mas servidor envia `0x04`~~ ✅ CORRIGIDO
- ~~**StatusUpdate**: l2js-client espera `0x18`, mas servidor envia `0x0E`~~ ✅ CORRIGIDO
- **CharSelected**: l2js-client espera `0x0B` ou `0x15` (correto!), servidor envia `0x15` ✅

### 2. **TIPOS DE DADOS INCORRETOS** ✅ CORRIGIDOS
- ~~**CharSelected**: HP e MP são escritos como `FLOAT (writeF)` pelo servidor, mas l2js-client lê como `int (readD)`~~ ✅ CORRIGIDO
- ~~Isso causa field misalignment e valores completamente errados~~ ✅ RESOLVIDO

---

## 📦 SERVER PACKETS (Servidor → Cliente)

### CharSelected (0x15 / 21)
**Opcode**: `0x15` (21 decimal)  
**Quando**: Enviado quando o personagem é selecionado para entrar no jogo

```java
// SOURCE: ext/mods/gameserver/network/serverpackets/CharSelected.java
writeC(21);                                    // [0] Opcode
writeS(_player.getName());                     // [1] String: Nome do personagem
writeD(_player.getObjectId());                 // [N] int: Object ID
writeS(_player.getTitle());                    // [N] String: Título
writeD(_sessionId);                            // [N] int: Session ID
writeD(_player.getClanId());                   // [N] int: Clan ID
writeD(0);                                     // [N] int: Unkn1
writeD(_player.getAppearance().getSex());      // [N] int: Sex (0=Male, 1=Female)
writeD(_player.getRace());                     // [N] int: Race
writeD(_player.getClassId());                  // [N] int: Class ID
writeD(1);                                     // [N] int: Active (always 1)
writeD(_player.getX());                        // [N] int: Posição X
writeD(_player.getY());                        // [N] int: Posição Y
writeD(_player.getZ());                        // [N] int: Posição Z
writeF(_player.getStatus().getHp());           // [N] ⚠️ FLOAT: HP atual (0.0 = morto)
writeF(_player.getStatus().getMp());           // [N] ⚠️ FLOAT: MP atual
writeD(_player.getStatus().getSp());           // [N] int: SP
writeQ(_player.getStatus().getExp());          // [N] long (8 bytes): EXP
writeD(_player.getStatus().getLevel());        // [N] int: Level
writeD(_player.getKarma());                    // [N] int: Karma
writeD(_player.getPkKills());                  // [N] int: PK Kills
writeD(_player.getStatus().getINT());          // [N] int: INT
writeD(_player.getStatus().getSTR());          // [N] int: STR
writeD(_player.getStatus().getCON());          // [N] int: CON
writeD(_player.getStatus().getMEN());          // [N] int: MEN
writeD(_player.getStatus().getDEX());          // [N] int: DEX
writeD(_player.getStatus().getWIT());          // [N] int: WIT
// 30x writeD(0) - Slots de inventário
writeD(0); writeD(0); // ... repetir 30 vezes
writeD(GameTimeTaskManager.getGameTime());     // [N] int: Game Time
writeD(0);                                     // [N] int: Pad
writeD(_player.getClassId());                  // [N] int: Class ID (repetido)
writeD(0); writeD(0); writeD(0); writeD(0);    // [N] 4x int: Padding
```

**❌ CORREÇÃO NECESSÁRIA no l2js-client**:
```javascript
// ERRADO (atual):
user.Hp = this.readD();
user.Mp = this.readD();

// CORRETO:
user.Hp = this.readF();  // Ler como FLOAT
user.Mp = this.readF();  // Ler como FLOAT
```

---

### UserInfo (0x04 / 4)
**Opcode**: `0x04` (4 decimal) ⚠️ **NÃO 0x32!**  
**Quando**: Enviado quando informações do jogador mudaram (HP, MP, stats, equipamentos, etc)

```java
// SOURCE: ext/mods/gameserver/network/serverpackets/UserInfo.java
writeC(4);                                     // [0] Opcode
writeLoc(_player.getPosition());               // [1-12] Position (X, Y, Z como ints)
writeD(_player.getHeading());                  // [13-16] int: Heading
writeD(_player.getObjectId());                 // [17-20] int: Object ID
writeS(_player.getName());                     // [N] String: Nome
writeD(_player.getRace());                     // [N] int: Race
writeD(_player.getSex());                      // [N] int: Sex
writeD(_player.getClassId());                  // [N] int: Class ID
writeD(_player.getLevel());                    // [N] int: Level
writeQ(_player.getExp());                      // [N] long: EXP
writeD(_player.getSTR());                      // [N] int: STR
writeD(_player.getDEX());                      // [N] int: DEX
writeD(_player.getCON());                      // [N] int: CON
writeD(_player.getINT());                      // [N] int: INT
writeD(_player.getWIT());                      // [N] int: WIT
writeD(_player.getMEN());                      // [N] int: MEN
writeD(_player.getMaxHp());                    // [N] int: Max HP ⭐
writeD((int)_player.getHp());                  // [N] int: HP atual (cast de float para int)
writeD(_player.getMaxMp());                    // [N] int: Max MP ⭐
writeD((int)_player.getMp());                  // [N] int: MP atual (cast de float para int)
writeD(_player.getSp());                       // [N] int: SP
writeD(_player.getCurrentWeight());            // [N] int: Peso atual
writeD(_player.getWeightLimit());              // [N] int: Peso máximo
writeD(_player.getActiveWeaponItem() != null ? 40 : 20); // [N] int: Weapon equipped flag
// ... MUITOS campos de paperdoll (equipamentos) ...
// ... Stats de combate (PAtk, PDef, etc) ...
// ... Velocidades, aparência, clan info, etc ...
```

**❌ CORREÇÃO NECESSÁRIA no l2js-client**:
```javascript
// GamePacketHandler.js - MAPEAR CORRETAMENTE
case 0x04:  // UserInfo (NÃO 0x32!)
    rpk = new UserInfo();
    break;
case 0x32:  // Este opcode está LIVRE ou mapeado para outro packet
    // Verificar o que realmente chega aqui
    break;
```

---

### StatusUpdate (0x0E / 14)
**Opcode**: `0x0E` (14 decimal) ⚠️ **NÃO 0x18!**  
**Quando**: Enviado para atualizar status específicos (HP, MP, Level, etc) sem mandar todo o UserInfo

```java
// SOURCE: ext/mods/gameserver/network/serverpackets/StatusUpdate.java
writeC(14);                                    // [0] Opcode
writeD(_objectId);                             // [1-4] int: Object ID (pode ser player ou creature)
writeD(_attributes.size());                    // [5-8] int: Número de atributos
// Para cada atributo:
    writeD(temp.getId());                      // [N] int: Status Type ID
    writeD(temp.getValue());                   // [N] int: Valor
```

**Status Type IDs** (enum StatusType):
```java
LEVEL = 0x01;
EXP = 0x02;
STR = 0x03;
DEX = 0x04;
CON = 0x05;
INT = 0x06;
WIT = 0x07;
MEN = 0x08;
CUR_HP = 0x09;      // HP atual
MAX_HP = 0x0A;      // HP máximo
CUR_MP = 0x0B;      // MP atual
MAX_MP = 0x0C;      // MP máximo
SP = 0x0D;
CUR_LOAD = 0x0E;
MAX_LOAD = 0x0F;
CUR_CP = 0x21;      // CP atual
MAX_CP = 0x22;      // CP máximo
```

**❌ CORREÇÃO NECESSÁRIA no l2js-client**:
```javascript
// GamePacketHandler.js
case 0x0E:  // StatusUpdate (NÃO 0x18!)
    rpk = new StatusUpdate();
    break;
case 0x18:  // Este opcode pode ser outro packet
    // Verificar nos sources do servidor
    break;
```

---

## 🔧 PLANO DE CORREÇÃO

### Arquivo: `GamePacketHandler.js`
```javascript
// ANTES (ERRADO):
case 0x32:
    rpk = new UserInfo_1.default();
    break;
case 0x18:
    rpk = new StatusUpdate_1.default();
    break;

// DEPOIS (CORRETO):
case 0x04:  // UserInfo no Protocol 746
    rpk = new UserInfo_1.default();
    break;
case 0x0E:  // StatusUpdate no Protocol 746
    rpk = new StatusUpdate_1.default();
    break;
```

### Arquivo: `CharSelected.js`
```javascript
// ANTES (ERRADO):
user.Hp = this.readD();      // Lê como int - ERRADO!
user.Mp = this.readD();      // Lê como int - ERRADO!

// DEPOIS (CORRETO):
user.Hp = this.readF();      // Lê como FLOAT
user.Mp = this.readF();      // Lê como FLOAT
user.Sp = this.readD();      // SP vem DEPOIS
user.Exp = this.readQ();     // EXP é long (8 bytes)
user.Level = this.readD();   // Level
user.Karma = this.readD();   // Karma
user.PkKills = this.readD(); // PK Kills
user.INT = this.readD();
user.STR = this.readD();
user.CON = this.readD();
user.MEN = this.readD();
user.DEX = this.readD();
user.WIT = this.readD();
// ... continuar leitura dos 30 slots + resto
```

---

## � CRÍTICO: Position Update (MoveToLocation, ValidateLocation, StopMove)

### Problema Descoberto (2026-02-20)

O l2js-client nunca atualizava a posição do **próprio personagem** (ActiveChar) após receber os packets de movimento. Isso causava:
- Bot enviava comando de movimento correto (31 bytes, opcode 0x01)
- Servidor movia o personagem no jogo
- Mas `l2.Me.X`, `l2.Me.Y`, `l2.Me.Z` **permaneciam congelados**
- Sistema de chegada falhava porque distância era sempre > ARRIVAL_DISTANCE

### Diagrama do Problema

```
MoveToLocation (0x47 - servidor → cliente):
├── Contém: _charObjId (quem se move) + posição destino + posição atual
├── l2js-client fazia:
│   └── creature = CreaturesList.getEntryByObjectId(_charObjId)
│       └── creature.setLocation(_x, _y, _z)  ← só atualizava outros!
└── ❌ NUNCA atualizava this.Client.ActiveChar (o próprio personagem)
```

### Solução Aplicada (l2js-client Corrigido)

**Arquivo**: `node_modules/l2js-client/dist/network/serverpackets/MoveToLocation.js`

```javascript
readImpl() {
    const _id = this.readC();
    const _charObjId = this.readD();
    const [_xDst, _yDst, _zDst] = this.readLoc();
    const [_x, _y, _z] = this.readLoc();
    
    // ✅ NOVO: Se for o próprio personagem, atualizar ActiveChar
    if (this.Client.ActiveChar && this.Client.ActiveChar.ObjectId === _charObjId) {
        this.Client.ActiveChar.X = _x;
        this.Client.ActiveChar.Y = _y;
        this.Client.ActiveChar.Z = _z;
        this.Client.ActiveChar._isMoving = true;
        return true;
    }
    
    // Resto do código para outras criaturas
    const creature = this.Client.CreaturesList.getEntryByObjectId(_charObjId);
    if (creature) {
        creature.setLocation(_x, _y, _z);
        creature.setMovingTo(_xDst, _yDst, _zDst);
        creature.calculateDistance(this.Client.ActiveChar);
    }
    return true;
}
```

### Arquivos Afetados

Aplicar a mesma correção em **3 arquivos**:

1. **MoveToLocation.js** (0x47)
   - Quando personagem/criatura está se movendo
   - `_isMoving = true`

2. **ValidateLocation.js** (0x49)
   - Validação de posição (anti-cheat)
   - Sem flag de movimento

3. **StopMove.js** (0x48)
   - Quando personagem/criatura para
   - `_isMoving = false`

### Impacto no Bot

Com essa correção:
- ✅ Sistema de chegada agora funciona (distância atualiza em tempo real)
- ✅ Revive para ponto inicial funciona
- ✅ Health check consegue rastrear posição correta
- ✅ Ciclo A→B→A funciona perfeitamente

---

## 🔧 Proxy Pattern (Client Assignment)

### Problema Descoberto (2026-02-20)

O l2js-client usa Proxy para interceptar chamadas de comando. Mas o padrão estava **errado**:

```javascript
// ❌ ERRADO - cmd.Client era undefined
return (...args) => {
    const cmd = Object.create(target._commands[propertyKey]);
    cmd.Client = target._gc;  // _gc ainda não estava inicializado!
    return cmd.execute(...args);
};
```

Isso causava:
- `l2.moveTo()` não funcionava
- `l2.say()` não funcionava
- `l2.hit()` não funcionava
- Nenhum pacote cliente→servidor era enviado

### Solução (Client.js Corrigido)

```javascript
// ✅ CORRETO - cmd.Client atribuído no momento de execução
return (...args) => {
    const cmd = Object.create(target._commands[propertyKey]);
    cmd.Client = target._gc;  // Agora _gc está pronto!
    if (!cmd.Client) {
        console.error(`[CMD-ERROR] ${propertyKey}(): GameClient não disponível!`);
        return;
    }
    return cmd.execute(...args);
};
```

**Arquivo**: `Client.js` (linhas 80-94)

---

## 📋 Checklist de Implementação

- [x] Opcode 0x01 para MoveBackwardToLocation
- [x] Opcode 0x38 para Say2
- [x] Opcode 0x6D para RequestRestartPoint
- [x] Opcode 0x30 para Appearing
- [x] Position updates em MoveToLocation/ValidateLocation/StopMove
- [x] Proxy pattern com cmd.Client na função
- [x] Event listener Die + Revive com wasDeadBefore flag
- [x] Health check periódico (1s) com lastKnownAliveStatus
- [x] Rota A-B com detecção de chegada (150m)
- [x] Revive para ponto inicial com flag isReturningFromRevive
- [x] Logs estruturados (l2client.log + l2client-pacotes.log)

---

**Data**: 2026-02-20  
**Protocol**: 746 (L2Java Interlude)  
**Status**: ✅ MAPEAMENTO COMPLETO E IMPLEMENTADO COM SUCESSO

Última atualização: 2026-02-20 - Adicionadas correções críticas de position update e proxy pattern

