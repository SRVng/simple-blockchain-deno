import { createBlockchain } from "./blockchain.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  // TODO: Docker, RPC
  const blockchain = createBlockchain(3);

  setInterval(async () => {
    await blockchain.addBlock({ sender: "ME", to: "ME", amouth: "200BTC" });
  }, 2000);
}
