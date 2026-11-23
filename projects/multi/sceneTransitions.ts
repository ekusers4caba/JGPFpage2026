import { Vector3 } from "@babylonjs/core";

export interface TransitionData {
  destination: number;
  spawnPosition: Vector3;
}

const EDGE = 6;
const SPAWN = 5;
const Y = 0.9;

export function checkSceneTransition(
  currentScene: number,
  p: Vector3,
): TransitionData | null {
  switch (currentScene) {
    case 0:
      if (p.x < -EDGE) return { destination: 1, spawnPosition: new Vector3(SPAWN, Y, 0) };
      if (p.x > EDGE) return { destination: 2, spawnPosition: new Vector3(-SPAWN, Y, 0) };
      if (p.z > EDGE) return { destination: 3, spawnPosition: new Vector3(0, Y, -SPAWN) };
      break;

    case 1:
      if (p.x > EDGE) return { destination: 0, spawnPosition: new Vector3(-SPAWN, Y, 0) };
      break;

    case 2: 
      if (p.x < -EDGE) return { destination: 0, spawnPosition: new Vector3(SPAWN, Y, 0) };
      break;

    case 3: 
      if (p.z < -EDGE) return { destination: 0, spawnPosition: new Vector3(0, Y, SPAWN) };
      break;
  }
  return null;
}