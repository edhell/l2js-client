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
const Client = require("./dist/Client").default;

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
log(`Conectando em ${CREDENTIALS.Ip} como ${CREDENTIALS.Username}...`);

// Create a new L2 client instance
const l2 = new Client();

// Attempt to login with provided credentials
// enter() returns a Promise that resolves when login is successful
l2.enter(CREDENTIALS).then(() => {
  log(`Login bem-sucedido!`);
  
  // Send Appearing packet after initial login to enable movement
  // Some L2 server implementations require this packet
  setTimeout(() => {
    if (l2._gc) {
      l2._gc.sendPacket(new Appearing());
      log("Pacote Appearing enviado - movimento habilitado");
    }
  }, 1000);

  // ==================== EVENT HANDLERS ====================
  
  /**
   * ShortCutInit is fired when character is fully loaded in game
   * This is a good place to start your bot logic
   * 
   * At this point:
   * - l2.Me contains your character information
   * - l2.CreaturesList contains nearby NPCs/players/monsters
   * - l2.InventoryItems contains your items
   * - All game objects are loaded and ready
   */
  l2.on("PacketReceived:ShortCutInit", () => {
    log("Personagem totalmente inicializado!");
    
    // Check if character is dead on login
    // If dead, auto-revive before continuing
    if (l2.Me.IsDead) {
      log("Personagem está morto ao conectar, revivendo...");
      setTimeout(() => reviveAtTown(l2), 2000);
      
      // After revive, wait 6 seconds and then proceed with the rest
      // This gives time for the server to process revive and spawn
      setTimeout(() => {
        executeMainSequence(l2);
      }, 6000);
    } else {
      // If character is alive, proceed immediately
      executeMainSequence(l2);
    }
  });

}).catch(e => {
  log(`Erro de conexão: ${e.message || e}`);
  process.exit(1);
});

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
  log("\n========== INFORMAÇÕES DO PERSONAGEM ==========");
  log(`Nome: ${l2.Me.Name}`);
  log(`Level: ${l2.Me.Level}`);
  log(`Classe: ${l2.Me.ClassName} (ID: ${l2.Me.ClassId})`);
  log(`HP: ${l2.Me.Hp}/${l2.Me.MaxHp}`);
  log(`MP: ${l2.Me.Mp}/${l2.Me.MaxMp}`);
  log(`Posição Atual: X=${l2.Me.X}, Y=${l2.Me.Y}, Z=${l2.Me.Z}`);
  log(`ObjectId: ${l2.Me.ObjectId}`);
  log("=============================================\n");
  
  // 3. After 10 seconds, move to a new location (X + 300)
  // moveTo() sends MoveBackwardToLocation packet to the server
  log("Aguardando 10 segundos antes de mover...");
  setTimeout(() => {
    const newX = l2.Me.X + 300;  // Move 300 units in X direction
    const newY = l2.Me.Y;         // Keep same Y
    const newZ = l2.Me.Z;         // Keep same Z
    
    log(`Movendo para nova posição: X=${newX}, Y=${newY}, Z=${newZ}`);
    
    try {
      l2.moveTo(newX, newY, newZ);
      log("Comando de movimento enviado com sucesso!");
    } catch (e) {
      log(`Erro ao mover: ${e.message}`);
    }
  }, 10000);
}

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
