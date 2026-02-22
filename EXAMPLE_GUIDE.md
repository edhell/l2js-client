# L2JS-Client - Example Bot Guide

Guia completo para executar e entender o arquivo `example.js`.

## 📋 Requisitos

1. **Servidor Lineage 2 Protocol 746** em execução
   - Endereço IP do servidor (padrão: 127.0.0.1)
   - Porta Login (padrão: 2106)
   - Porta Game (padrão: 7777)

2. **Node.js 16+** instalado

3. **Projeto compilado**:
   ```bash
   npm run compile
   ```

## 🔧 Configuração

Edite as credenciais no arquivo `example.js` (linhas 34-39):

```javascript
const CREDENTIALS = {
  Username: "ed2",        // Seu username
  Password: "ed",         // Sua senha
  Ip: "127.0.0.1",        // IP do servidor
  ServerId: 1,            // ID do servidor
  CharSlotIndex: 0        // Slot do personagem (0 = primeiro)
};
```

## 🚀 Execução

```bash
node example.js
```

## 📊 O Que o Exemplo Demonstra

### 1. **Login e Autenticação** (0-1 segundos)
- Conecta ao servidor de login
- Autentica com credenciais
- Seleciona personagem automaticamente
- Inicia a sessão de jogo

```
[Login bem-sucedido!]
[Pacote Appearing enviado - movimento habilitado]
```

### 2. **Informações do Personagem** (1-3 segundos)
- Nome, Level, Classe
- HP/MP atuais
- Posição (X, Y, Z)
- Object ID

```
========== INFORMAÇÕES DO PERSONAGEM ==========
Nome: ed2
Level: 6
Classe: Human Fighter (ID: 0)
HP: 221/221
MP: 74/74
Posição Atual: X=-82249, Y=246240, Z=-3688
ObjectId: 268493179
```

### 3. **Criaturas Próximas** (3 segundos)
- Lista top 10 NPCs/Monstros/Players mais próximos
- Calcula distância 3D em tempo real
- Ordena por proximidade

```
========== CRIATURAS PRÓXIMAS ==========
Mostrando 3 de 10 criatura(s) total:
────────────────────────────────────────────────────────────────────────────────
1. [NPC] Guard (Lvl 1) - 45 unidades
   Coordenadas: X=-82300, Y=246150, Z=-3688
2. [MONSTER] Goblin (Lvl 5) - 127 unidades
   Coordenadas: X=-82100, Y=246500, Z=-3688
```

### 4. **Inventário** (4 segundos)
- Lista todos os itens do personagem
- Mostra quantidade (x N)
- Marca itens equipados

```
========== INVENTÁRIO ==========
Total de itens: 5
────────────────────────────────────────────────────────────────
1. Short Sword (ID: 1)
2. Shirt x1 [EQUIPADO]
3. Leather Pants x1 [EQUIPADO]
```

### 5. **Buffs Ativos** (5 segundos)
- Lista todos os buffs/debuffs
- Mostra nível da skill
- Exibe tempo restante (se disponível)

```
========== BUFFS ATIVOS ==========
Total de buffs: 2
────────────────────────────────────────────────────────────────
1. Blessing of the Gods (Lvl 1) - 300s restantes
2. Shield Defense (Lvl 1) - 180s restantes
```

### 6. **Membros da Party** (6 segundos)
- Lista membros da party (se houver)
- HP/MP de cada membro
- Distância do personagem

```
========== MEMBROS DA PARTY ==========
Total de membros: 3
────────────────────────────────────────────────────────────────────────────────
1. Player1 (Lvl 10) - HP: 450/450 | MP: 200/200 - 50 unidades
2. Player2 (Lvl 8) - HP: 380/380 | MP: 180/180 - 75 unidades
```

### 7. **Chat Listener** (tempo real)
- Monitora TODAS as mensagens recebidas
- Identifica tipo de chat (geral, shout, PM, party, clan, trade, etc.)
- Formato: `[CHAT TIPO] Nome: Mensagem`

```
[CHAT GERAL] Player1: Oi galera!
[CHAT SHOUT] Admin: Servidor online!
[CHAT PM] Player2: Tem item?
[CHAT PARTY] Player3: Vamos atacar?
```

### 8. **Movimentação** (10 segundos)
- Move o personagem 300 unidades no eixo X
- Valida posição antes de mover
- Re-lista criaturas após movimento

```
Movendo para nova posição: X=-81949, Y=246240, Z=-3688
Comando de movimento enviado com sucesso!
```

## 📝 Estrutura do Código

### Funções Principais

| Função | Descrição |
|--------|-----------|
| `log(message)` | Log com timestamp |
| `reviveAtTown(l2)` | Revive automático na cidade |
| `calculateDistance(x1,y1,z1,x2,y2,z2)` | Calcula distância 3D |
| `listNearbyCreatures(l2, limit)` | Lista top N criaturas próximas |
| `listInventoryItems(l2)` | Lista itens do inventário |
| `listBuffs(l2)` | Lista buffs ativos |
| `listPartyMembers(l2)` | Lista membros da party |
| `executeMainSequence(l2)` | Sequência principal |

### Propriedades de l2 (Client)

```javascript
l2.Me                    // Personagem ativo (L2User)
l2.Me.Name              // Nome do personagem
l2.Me.Level             // Level
l2.Me.HP / l2.Me.MaxHP  // Vida
l2.Me.MP / l2.Me.MaxMP  // Mana
l2.Me.X, l2.Me.Y, l2.Me.Z  // Posição
l2.Me.Buffs             // Array de buffs ativos
l2.Me.IsDead            // Se está morto

l2.CreaturesList.Collection  // Map de todas as criaturas próximas
l2.InventoryItems       // Array de itens do inventário
l2.PartyMembers         // Array de membros da party
```

### Eventos Disponíveis

Alguns eventos que você pode usar:

```javascript
// Chat
l2.on("PacketReceived:CreatureSay", (e) => {
  console.log(`[CHAT] ${e.data.CharName}: ${e.data.Text}`);
});

// Quando personagem carrega completamente
l2.on("PacketReceived:ShortCutInit", () => {
  console.log("Personagem carregado!");
});

// Quando recebe dano
l2.on("PacketReceived:Attack", (e) => {
  console.log(`Recebeu ${e.data.Damage} de dano!`);
});

// Quando alguém se move perto
l2.on("PacketReceived:MoveToLocation", (e) => {
  console.log(`Criatura moveu para ${e.data.X}, ${e.data.Y}`);
});
```

## 🎮 Exemplos de Uso

### Enviar Mensagens

```javascript
l2.say("Olá todos!");           // Chat geral
l2.shout("VENDO ITENS!");        // Shout (!)
l2.tell("Player1", "Oi!");       // Mensagem privada
l2.sayToParty("Vamos?");         // Chat de party
l2.sayToClan("Mission party");   // Chat de clan
```

### Interagir com NPCs

```javascript
const npc = l2.CreaturesList.Collection.values().next().value;
if (npc && npc.constructor.name === 'L2Npc') {
  l2.interact(npc.ObjectId);  // Abrir menu do NPC
}
```

### Atacar Inimigos

```javascript
const monster = l2.CreaturesList.Collection.values().next().value;
if (monster && monster.constructor.name === 'L2Mob') {
  l2.attack(monster.ObjectId);  // Atacar monstro
}
```

### Usar Skills

```javascript
l2.useSkill(skillId, targetObjectId);
```

### Usar Itens

```javascript
l2.useItem(itemObjectId);
```

## 🐛 Troubleshooting

### "Cannot connect to server"
- Verifique se o servidor está rodando
- Confirme IP e portas corretas
- Verifique firewall

### "Login failed"
- Verifique credenciais (username/password)
- Verifique se o personagem existe
- Verifique se a conta é válida

### "Personagem ainda não está carregado"
- Aguarde mais time para o personagem carregar
- Aumente o timeout nos setTimeout()

### "Nenhuma criatura encontrada"
- O personagem está em uma área vazia
- Ajuste a lógica de filtragem
- Verifique se há NPCs/Monstros perto

## 📚 Links Úteis

- [L2JS-Client Documentação](./docs/guide/api.html)
- [Protocol 746 Opcodes](./PROTOCOL_746_OPCODES_COMPLETE.md)
- [Packet Mapping](./PROTOCOL_746_PACKET_MAPPING.md)

## 💡 Próximos Passos

1. Modifique o exemplo para sua lógica de bot
2. Adicione mais listeners de eventos
3. Implemente AI (inteligência artificial)
4. Configure para rodar continuamente
5. Adicione logger para monitorar ações

## ⚠️ Avisos

- Este é um bot de exemplo educacional
- Respeite os ToS do servidor
- Não use em servidores que proíbem bots
- Sempre teste em servidor privado primeiro
- Monitore seu bot enquanto isso está rodando
