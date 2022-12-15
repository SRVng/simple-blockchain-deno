import { Block, createBlock } from "./block.ts";

interface Blockchain {
  readonly genesis: Block;
  chain: Array<Block>;
  difficulty: number;

  getLatestBlock(): Block;
  addBlock<T>(data: T): Promise<void>;
  checkValidity(): void;
}

export function createBlockchain(
  difficulty: Blockchain["difficulty"]
): Blockchain {
  const genesisBlock: Block = createBlock({});
  genesisBlock.hash = "0";

  return {
    genesis: genesisBlock,
    chain: [],
    difficulty,
    getLatestBlock() {
      return this.chain.at(-1) || this.genesis;
    },
    async addBlock<T>(data: T): Promise<void> {
      const encodeData = new TextEncoder().encode(JSON.stringify(data));
      const newBlock = createBlock({
        data: encodeData,
        previousHash: this.getLatestBlock().hash,
      });

      await newBlock.mineBlock(this.difficulty);
      this.chain.push(newBlock);

      console.log("Block added: ", newBlock.hash);
    },
    checkValidity() {
      this.chain.forEach(async (current, index, blocks) => {
        const previousHash = blocks[index - 1].hash;
        const currentHash = current.hash;

        if (
          currentHash != (await current.calculateHash()) ||
          previousHash != current.previous_hash
        ) {
          throw new Error(`Block ${index} has been tampered`);
        }
      }, [] as Array<boolean>);
    },
  };
}
