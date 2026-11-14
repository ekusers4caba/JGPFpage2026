// havok.ts
import HavokPhysics from "@babylonjs/havok";

export async function getHavok() {
  const wasmUrl = new URL("./HavokPhysics.wasm", import.meta.url);
  const response = await fetch(wasmUrl);
  if (!response.ok) {
    throw new Error(`Failed to load Havok WASM: ${response.status} ${response.statusText}`);
  }

  return HavokPhysics({
    wasmBinary: await response.arrayBuffer(),
  });
}