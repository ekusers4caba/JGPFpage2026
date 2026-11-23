import { Vector3 } from "@babylonjs/core";

export interface TransitionData {
  destination: number; // scene index (0 = Scene 1)
  spawnPosition: Vector3;
}

// Ground is 14x14 (edges at +/-7). Cross +/-EDGE to leave, arrive at +/-SPAWN.
const EDGE = 6;
const SPAWN = 5;
const Y = 0.9; // capsule centre height

export function checkSceneTransition(
  currentScene: number,
  p: Vector3,
): TransitionData | null {
  switch (currentScene) {
    case 0: // Scene 1
      if (p.x < -EDGE) return { destination: 1, spawnPosition: new Vector3(SPAWN, Y, 0) };
      if (p.x > EDGE) return { destination: 2, spawnPosition: new Vector3(-SPAWN, Y, 0) };
      if (p.z > EDGE) return { destination: 3, spawnPosition: new Vector3(0, Y, -SPAWN) };
      break;

    case 1: // Scene 2: only the right edge does anything
      if (p.x > EDGE) return { destination: 0, spawnPosition: new Vector3(-SPAWN, Y, 0) };
      break;

    case 2: // Scene 3: only the left edge does anything
      if (p.x < -EDGE) return { destination: 0, spawnPosition: new Vector3(SPAWN, Y, 0) };
      break;

    case 3: // Scene 4: only the bottom edge does anything
      if (p.z < -EDGE) return { destination: 0, spawnPosition: new Vector3(0, Y, SPAWN) };
      break;
  }
  return null;
}