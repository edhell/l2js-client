/**
 * L2JS-Client Simple Example
 * 
 * This example demonstrates the basic usage of l2js-client library:
 * - Login and character selection
 * - Auto-revive if character is dead
 * - Send a welcome message to the game
 * - Display character information in console
 * - Move to a new location (X + 300) after 10 seconds
 * 
 * REQUIREMENTS:
 * 1. The project must be compiled first: npm run compile
 * 2. Configure your credentials in the CREDENTIALS object below
 * 3. Make sure your Lineage 2 server is running
 * 
 * SUPPORTED PROTOCOLS:
 * - Protocol 730-746 (Interlude)
 * 
 * USAGE:
 * node example.js
 */

const process = require("process");

// Force a conservative log level for this debug runner to avoid noisy DEBUG output.
// Note: LogLevel enum values: NONE=0, INFO=1, WARNING=2, ERROR=4, DEBUG=8
// This overrides any external L2JSC_LOG_LEVEL so this script stays quiet by default.
process.env.L2JSC_LOG_LEVEL = "1";          // INFO
process.env.L2JSC_VERBOSE_PACKETS = "1"; 

const Client = require("./dist/Client").default;

// Global events emitter (low-level hooks)
// const GlobalEvents = require('./dist/mmocore/EventEmitter').GlobalEvents;

// RawPacket logging temporarily disabled — uncomment to re-enable
/*
GlobalEvents.on('RawPacket', (e) => {
  try {
    const raw = e.data && e.data.raw ? e.data.raw : e.raw;
    if (!raw || !(raw instanceof Uint8Array)) return;
    const hex = Array.from(raw).map(b => b.toString(16).padStart(2, '0')).join(' ');
    log(`RawPacket (${raw.length} bytes): ${hex.substring(0, 800)}`);
  } catch (err) { // ignore }
});
*/


// Import packets for revive feature
// RequestRestartPoint: Used to revive character at town/fixed location/agathion
// Appearing: Confirms the character spawn location after teleport/revive
const RequestRestartPoint = require('./dist/network/clientpackets/RequestRestartPoint').default;
const Appearing = require('./dist/network/clientpackets/Appearing').default;

// ==================== CONFIGURATION ====================
// Configure your Lineage 2 server credentials here
const CREDENTIALS = {
  Username: "ed2",        // Your game account username
  Password: "ed",         // Your game account password
  Ip: "127.0.0.1",        // Lineage 2 server IP address (localhost or remote)
  ServerId: 1,            // Server ID to connect (check your AuthServer config)
  CharSlotIndex: 0        // Character slot (0 = first character, 1 = second, etc.)
};

// Coordenada inicial fixa para retorno após revive
const COORDENADA_INICIAL = { x: -81351, y: 246743, z: -3680 };

// Enable HWID key transform for bot compatibility
// This is required for some Lineage 2 server implementations
if (!process.env.L2_HWID_KEY) {
  process.env.L2_HWID_KEY = '1';
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Log messages with timestamp
 * @param {string} message - Message to log
 */
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Revive character at town when dead
 * @param {Client} l2 - The L2 client instance
 * 
 * This function sends two packets:
 * 1. RequestRestartPoint - Requests revive at specified location
 *    - 0 = TOWN (revive at nearest town)
 *    - 1 = AGATHION (revive using agathion)
 *    - 2 = FIXED (revive at fixed point)
 * 2. Appearing - Confirms character appearance at new location
 */
function reviveAtTown(l2) {
  if (!l2 || !l2._gc) {
    log("Cannot revive: GameClient not ready");
    return;
  }
  
  try {
    log("Revivendo na cidade...");
    
    // Send revive request (0 = TOWN)
    const packet = new RequestRestartPoint(0);
    l2._gc.sendPacket(packet);
    
    // After 2 seconds, send Appearing packet to confirm spawn
    // This is necessary to enable movement after revive/teleport
    setTimeout(() => {
      log("Enviando pacote Appearing...");
      l2._gc.sendPacket(new Appearing());
    }, 2000);
  } catch (e) {
    log(`Erro ao reviver: ${e.message}`);
  }
}

// ==================== MAIN CLIENT INITIALIZATION ====================
console.clear();

log("=== L2JS-Client Simple Example ===");

// Encapsula a tentativa de conexão para permitir retry quando
// a conta estiver em uso (REASON_ACCOUNT_IN_USE).
function connect() {
  log(`Conectando em ${CREDENTIALS.Ip} como ${CREDENTIALS.Username}...`);
  const l2 = new Client();

  l2.enter(CREDENTIALS).then(() => {
    log(`Login bem-sucedido!`);

    // Send Appearing packet after initial login to enable movement
    setTimeout(() => {
      if (l2._gc) {
        l2._gc.sendPacket(new Appearing());
        log("Pacote Appearing enviado - movimento habilitado");
      }
    }, 500);

    // ShortCutInit = personagem totalmente carregado
    l2.on("PacketReceived:ShortCutInit", () => {
      log("Personagem totalmente inicializado!");

      if (l2.Me.IsDead) {
        log("Personagem está morto ao conectar, revivendo...");
        setTimeout(() => reviveAtTown(l2), 2000);

        setTimeout(() => {
          executeMainSequence(l2);
        }, 6000);
      } else {
        executeMainSequence(l2);
      }
    });

  }).catch(e => {
    const errMsg = (e && e.message) ? e.message : String(e);
    // Reconhece mensagens típicas que indicam conta em uso
    if (String(errMsg).includes('REASON_ACCOUNT_IN_USE') || String(errMsg).includes('ACCOUNT_IN_USE')) {
      log("Conta em uso. Vou tentar novamente...");
      setTimeout(() => connect(), 500);
      return;
    }

    log(`Erro de conexão: ${errMsg}`);
    process.exit(1);
  });
}

// Inicia a primeira tentativa
connect();

// ==================== MAIN SEQUENCE ====================
/**
 * Main bot sequence - executed after character is fully initialized
 * @param {Client} l2 - The L2 client instance
 * 
 * This function demonstrates:
 * 1. Sending chat messages
 * 2. Accessing character properties (l2.Me)
 * 3. Moving to a location
 */
function executeMainSequence(l2) {
  // starting coordinates (fixed)
  const START_POS = { x: COORDENADA_INICIAL.x, y: COORDENADA_INICIAL.y, z: COORDENADA_INICIAL.z };

  // Shared runtime state for the main loop and event listeners
  let AUTOFARM_ENABLED = false;
  let NEED_RETURN = false; // set when we must return to START_POS (e.g. after death)
  let MOVING = false;      // true while a moveTo is in-flight
  let mainLoopId = null;

  // Reusable RawBypass packet helper (server expects opcode 0x21 + UTF-16LE string)
  try {
    const SendablePacket = require('./dist/mmocore/SendablePacket').default;
    class RawBypass extends SendablePacket {
      constructor(cmd) {
        super();
        this._cmd = cmd;
      }
      write() {
        this.writeC(0x21);
        this.writeS(this._cmd);
      }
    }
    // expose in this scope
    global.__RawBypass = RawBypass;
  } catch (e) {
    // fallback: don't break if SendablePacket not available
    global.__RawBypass = null;
  }

    // Main loop: keep trying to walk back to START_POS and enable autofarm when arrived.
    function startMainLoop() {
      if (mainLoopId) return;
      log('Iniciando loop principal de retorno / autofarm.');
      mainLoopId = setInterval(() => {
        try {
          if (!l2 || !l2.Me) return;

          // If dead, don't attempt movement; Die listener will request revive and
          // signal NEED_RETURN so movement will be attempted when alive again.
          if (l2.Me.IsDead) return;

          // If autofarm is active and we don't need to return, skip movement checks
          if (AUTOFARM_ENABLED && !NEED_RETURN) return;

          // If we need to return or are not at start, try walking there
          if (NEED_RETURN || !isAtStart()) {
            if (!MOVING) {
              MOVING = true;
              log(`Tentando caminhar para posição inicial: X=${START_POS.x} Y=${START_POS.y} Z=${START_POS.z}`);
              try {
                l2.moveTo(START_POS.x, START_POS.y, START_POS.z);
              } catch (err) {
                log('Erro ao enviar comando de movimento: ' + String(err.message || err));
                MOVING = false;
                return;
              }

              // Poll for arrival using IsMoving / IsReady and euclidean distance
              const sx = l2.Me.X || 0;
              const sy = l2.Me.Y || 0;
              const sz = l2.Me.Z || 0;
              const dx0 = START_POS.x - sx;
              const dy0 = START_POS.y - sy;
              const dz0 = START_POS.z - sz;
              const totalDist = Math.sqrt(dx0 * dx0 + dy0 * dy0 + dz0 * dz0) || 1;
              log(`Distância inicial até o ponto: ${totalDist.toFixed(2)} unidades.`);

              let tries = 0;
              const maxTries = 60; // ~60s fallback
              const poll = setInterval(() => {
                tries++;
                const cx = l2.Me.X || 0;
                const cy = l2.Me.Y || 0;
                const cz = l2.Me.Z || 0;
                const dx = START_POS.x - cx;
                const dy = START_POS.y - cy;
                const dz = START_POS.z - cz;
                const curDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                const percent = Math.max(0, Math.min(100, Math.round((1 - (curDist / totalDist)) * 100)));

                // Consider arrived when within 100 units or when engine reports not moving and ready
                const arrivedByPos = curDist < 100;
                const notMoving = (l2.Me.IsMoving === false) || (l2.Me.IsRunning === false && l2.Me.IsMoving === false);
                const ready = (typeof l2.Me.IsReady === 'boolean') ? l2.Me.IsReady : false;

                if (arrivedByPos || (!l2.Me.IsDead && notMoving && ready)) {
                  clearInterval(poll);
                  MOVING = false;
                  NEED_RETURN = false;
                  log(`Chegou ao ponto inicial — distancia restante ${curDist.toFixed(2)}. Pausando verificação.`);
                  // Ensure autofarm enabled when at start
                  if (!AUTOFARM_ENABLED) {
                    try {
                      log('Ativando autofarm ao chegar no ponto inicial...');
                      if (global.__RawBypass) {
                        l2._gc.sendPacket(new global.__RawBypass('autofarm change_status'));
                        log('Bypass enviado: autofarm change_status');
                      } else {
                        log('RawBypass não disponível — não enviei o bypass');
                      }
                      AUTOFARM_ENABLED = true;
                    } catch (e) { log('Erro ao ativar autofarm: ' + String(e.message || e)); }
                  }
                } else if (tries >= maxTries) {
                  clearInterval(poll);
                  MOVING = false;
                  log('Timeout ao caminhar para o ponto inicial; vou tentar novamente.');
                } else {
                  log(`Movendo... distancia restante: ${curDist.toFixed(2)} (${percent}% completado). Tentativa ${tries}/${maxTries}`);
                }
              }, 1500);
            }
          } else {
            // We're at start and alive: ensure autofarm is active
            if (!AUTOFARM_ENABLED) {
                try {
                log('Personagem no ponto inicial e vivo — ativando autofarm.');
                if (global.__RawBypass) {
                  l2._gc.sendPacket(new global.__RawBypass('autofarm change_status'));
                  log('Bypass enviado: autofarm change_status');
                } else {
                  log('RawBypass não disponível — não enviei o bypass');
                }
                AUTOFARM_ENABLED = true;
              } catch (e) { log('Erro ao ativar autofarm: ' + String(e.message || e)); }
            }
          }
        } catch (err) {
          log('Erro no loop principal: ' + String(err.message || err));
        }
      }, 3000);
    }

    // start the loop
    startMainLoop();
  // Helper shared by loop/listeners: are we close to the start pos?
  const isAtStart = () => {
    if (!l2.Me) return false;
    const cx = l2.Me.X || 0;
    const cy = l2.Me.Y || 0;
    const cz = l2.Me.Z || 0;
    const dx = Math.abs(cx - START_POS.x);
    const dy = Math.abs(cy - START_POS.y);
    const dz = Math.abs(cz - START_POS.z);
    return (dx + dy + dz) < 100;
  };

  // 1. Send a chat message to confirm bot is online
  // Available methods: say(), shout(), tell(), sayToParty(), sayToClan(), etc.
  try {
    l2.say("Entrei no jogo!");
    log("Mensagem enviada: 'Entrei no jogo!'");
  } catch (e) {
    log(`Erro ao enviar mensagem: ${e.message}`);
  }
  
  // 2. Display character information in console
  // l2.Me contains all your character data:
  // - Name, Level, ClassName (auto-derived from ClassId), HP, MP, Position, etc.
  function printCharacterInfo() {
    log("========== INFORMAÇÕES DO PERSONAGEM ==========");
    log(`Nome: ${l2.Me.Name}`);
    log(`Level: ${l2.Me.Level}`);
    log(`Classe: ${l2.Me.ClassName} (ID: ${l2.Me.ClassId})`);
    log(`HP: ${l2.Me.Hp}/${l2.Me.MaxHp}`);
    log(`MP: ${l2.Me.Mp}/${l2.Me.MaxMp}`);
    log(`Posição Atual: X=${l2.Me.X}, Y=${l2.Me.Y}, Z=${l2.Me.Z}`);
    log(`ObjectId: ${l2.Me.ObjectId}`);
    log("=============================================\n");
  }

  // Some packets (e.g. CharSelected) populate partial data (HP/MP),
  // while `UserInfo` provides Level/MaxHp/MaxMp. If those values
  // are missing, wait for `UserInfo` before printing.
  if (l2.Me.Level === undefined || l2.Me.MaxHp === undefined || l2.Me.MaxMp === undefined) {
    log("Aguardando pacote UserInfo para completar dados do personagem...");
    l2.on("PacketReceived:UserInfo", () => {
      printCharacterInfo();
    });
  } else {
    printCharacterInfo();
  }
  
  // 3. After 10 seconds, move to a new location (X + 300)
  // moveTo() sends MoveBackwardToLocation packet to the server
  // Try multiple bypass variants and log NpcHtmlMessage/SystemMessage for diagnosis
  (function tryAutofarmBypassVariants() {
      const variants = [
      // 'bypass autofarm change_status' is intentionally omitted here.
      // We only enable/disable autofarm immediately if the character
      // is already at the START_POS. Otherwise activation is handled
      // after revive+move-to-start to avoid enabling autofarm in the
      // wrong location.
      'bypass -h autofarm index',
      'bypass autofarm index',
      'bypass autofarm help options.htm'
    ];

    try {
      const SendablePacket = require('./dist/mmocore/SendablePacket').default;

      // Small helper to send bypass using server-expected opcode 0x21 (decimal 33)
      class RawBypass extends SendablePacket {
        constructor(cmd) {
          super();
          this._cmd = cmd;
        }
        write() {
          // opcode expected by the provided game server source: 0x21
          this.writeC(0x21);
          this.writeS(this._cmd);
        }
      }

      if (!(l2._gc && typeof l2._gc.sendPacket === 'function')) {
        log('GameClient não pronto para enviar bypass (l2._gc ausente).');
        return;
      }

      let confirmed = false;

      // enable auto-loot/pickup (herbs) before starting autofarm
      try {
        const pickupCmd = 'autofarm toggle pickup';
        log(`Habilitando autoloot (pickup) com comando: "${pickupCmd}"`);
        if (global.__RawBypass) l2._gc.sendPacket(new global.__RawBypass(pickupCmd));
      } catch (e) { log(`Erro ao enviar comando de pickup: ${e.message}`); }
      // (isAtStart moved to outer scope)
      try {
        if (isAtStart()) {
          log('Personagem já está na posição inicial — ativando autofarm agora.');
          if (global.__RawBypass) {
            l2._gc.sendPacket(new global.__RawBypass('autofarm change_status'));
            log('Bypass enviado: autofarm change_status');
          } else {
            log('RawBypass não disponível — não enviei o bypass');
          }
          AUTOFARM_ENABLED = true;
          confirmed = true;
        } else {
          log('Personagem NÃO está na posição inicial — não ativando autofarm agora.');
        }
      } catch (e) { log('Erro ao condicionar ativação autofarm: ' + e.message); }
      function inspectHtml(html) {
        const normalized = String(html || '').toLowerCase();
        if (normalized.includes('auto farm') || normalized.includes('autofarm') || normalized.includes('%status%') || normalized.includes('auto farm')) {
          return true;
        }
        // common portuguese/english words
        if (normalized.includes('ativ') || normalized.includes('lig') || normalized.includes('on') || normalized.includes('off') || normalized.includes('enabled') || normalized.includes('disabled')) return true;
        return false;
      }

      l2.on('PacketReceived:NpcHtmlMessage', (e) => {
        try {
          const html = e.data.packet && e.data.packet.html ? e.data.packet.html : (e.data.html || '');
          log('=== NpcHtmlMessage RECEBIDO ===');
          log(String(html).substring(0, 2000).replace(/\s+/g, ' '));
          if (!confirmed && inspectHtml(html)) {
            confirmed = true;
            AUTOFARM_ENABLED = true;
            log('Confirmação detectada dentro do NpcHtmlMessage. Autofarm provavelmente ativado.');
          }
        } catch (err) { log('Erro ao processar NpcHtmlMessage: ' + String(err.message || err)); }
      });

      l2.on('PacketReceived:SystemMessage', (e) => {
        try {
          log('=== SystemMessage RECEBIDO ===');
          log(JSON.stringify(e.data).substring(0, 1000));
          confirmed = true;
          // system messages may indicate state but we don't assume autofarm toggled
        } catch (err) { }
      });

      // Send bypass variants spaced out to avoid flooding; server expects the inner command
      variants.forEach((v, i) => {
        setTimeout(() => {
          if (confirmed) return;
          try {
            // normalize: remove leading 'bypass ' if present (server expects e.g. 'autofarm change_status')
            const cmd = String(v).replace(/^bypass\s+/i, '').trim();
            log(`Enviando bypass variante: "${cmd}" (opcode 0x21)`);
            if (global.__RawBypass) l2._gc.sendPacket(new global.__RawBypass(cmd));
          } catch (e) { log(`Erro ao enviar bypass variante '${v}': ${e.message}`); }
        }, i * 700);
      });

      // Keep process alive for debugging - user will Ctrl+C when done

      process.on('SIGINT', () => {
        log('SIGINT detectado — saindo sem enviar comandos de stop (não iremos alterar o estado).');
        process.exit();
      });

    } catch (e) {
      log(`Erro ao tentar preparar/enviar bypasses: ${e.message}`);
    }

  })();

  // Global listener for death: disable autofarm, request revive and signal return
  l2.on('Die', (evt) => {
    try {
      const creature = evt && evt.data && evt.data.creature ? evt.data.creature : null;
      if (!creature) return;
      if (creature.ObjectId !== (l2.Me && l2.Me.ObjectId)) return;

      log('Detectado morte do personagem (listener global). Desativando autofarm e solicitando revive.');
      try {
        if (AUTOFARM_ENABLED && global.__RawBypass) {
          log('Desativando autofarm (envio de change_status)...');
          l2._gc.sendPacket(new global.__RawBypass('autofarm change_status'));
        }
      } catch (e) { /* ignore send errors */ }

      AUTOFARM_ENABLED = false;
      NEED_RETURN = true;
      MOVING = false;
      try { reviveAtTown(l2); } catch (e) { log('Erro ao solicitar revive: ' + String(e.message || e)); }
    } catch (err) { }
  });

    } // end executeMainSequence

// ==================== CLEANUP ON EXIT ====================
/**
 * Handle Ctrl+C gracefully
 * Clean up resources and exit the application
 */
process.on('SIGINT', () => {
  log("Encerrando...");
  // Optionally: l2.logout() to properly disconnect
  process.exit();
});
