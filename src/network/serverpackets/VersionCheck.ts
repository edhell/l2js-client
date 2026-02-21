import GameClientPacket from "./GameClientPacket";
import BlowfishEngine from "../../security/crypt/BlowfishEngine";

export default class VersionCheck extends GameClientPacket {
  // @Override
  readImpl(): boolean {
    const _id = this.readC(); // Packet ID (0x00)
    const _protocolStatus = this.readC(); // 0 = wrong protocol, 1 = protocol ok
    
    if (0 === _protocolStatus) {
      throw Error("Wrong protocol version!");
    }
    
    // Read 8-byte key sent by server
    let key = this.readB(8);
    
    // Read server metadata (Blowfish enabled flag and unknown value)
    const _blowfishEnabled = this.readD();
    const _unkn = this.readD();

    // If HWID guard is enabled on server, key bytes are transformed.
    // Decrypt the 8-byte block using the server SKBOX to recover real key.
    const useHwidKeyTransform = (process && process.env && process.env.L2_HWID_KEY === "1");
    if (useHwidKeyTransform) {
      const skbox = Uint8Array.from([0x6e, 0x24, 0x02, 0x0f, 0xfb, 0x11, 0x18, 0x17, 0x12, 0x2d, 0x01, 0x15, 0x7a, 0x10, 0xfb, 0x0c]);
      const bf = new BlowfishEngine();
      bf.init(skbox);
      const decrypted = new Uint8Array(8);
      bf.decryptBlock(key, 0, decrypted, 0);
      key = decrypted;
    }

    // Build 16-byte Blowfish key: 8 bytes from server + 8 static bytes
    const _blowfishKey: Uint8Array = new Uint8Array(16);
    _blowfishKey.set(key, 0);
    _blowfishKey.set(Uint8Array.from([0xc8, 0x27, 0x93, 0x01, 0xa1, 0x6c, 0x31, 0x97]), 8); // Static bytes from BlowFishKeygen

    // Initialize encryption with the key
    this.Client.setCryptInitialKey(_blowfishKey);
    
    return true;
  }

  // @Override
  run(): void {
    // Encryption key initialized in readImpl()
  }
}
