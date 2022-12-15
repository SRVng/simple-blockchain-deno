import {
  crypto,
  toHashString,
} from "https://deno.land/std@0.168.0/crypto/mod.ts";

export interface Block {
  readonly data?: Uint8Array;
  hash: string;
  readonly previous_hash?: string;
  readonly timestamp: number;
  pow: number;

  calculateHash(): Promise<string>;
  mineBlock(difficulty: number): Promise<void>;
}

export function createBlock(params: {
  data?: Uint8Array;
  previousHash?: string;
}): Block {
  const { data, previousHash } = params;
  return {
    data,
    hash: String(),
    previous_hash: previousHash,
    timestamp: Date.now(),
    pow: 0,
    async calculateHash(this: Block): Promise<string> {
      const buffer: ArrayBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(constructHashData.bind(this)()),
      );
      this.hash = toHashString(buffer, "hex");

      return this.hash;
    },
    async mineBlock(difficulty: number): Promise<void> {
      const initialHash = await this.calculateHash();
      console.log("Initial hash: ", initialHash);
      while (!this.hash.startsWith("0".repeat(difficulty))) {
        this.pow++;
        const calculatedHash = await this.calculateHash();
        console.log("Calculated hash", calculatedHash);
      }
      console.log("Block Mined!");
    },
  };
}

// Private functions
function constructHashData<T>(this: Block): string {
  if (!this.previous_hash) {
    throw new Error("No previous_hash");
  }
  return JSON.stringify(this.data).concat(
    this.previous_hash,
    this.timestamp.toString(10),
    this.pow.toString(10),
  );
}
