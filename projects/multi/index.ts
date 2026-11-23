import {
  Engine,
  Vector3,
  MeshBuilder,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
  ArcRotateCamera,
} from "@babylonjs/core";

import createScene1 from "./scene1/createStartScene";
import createScene2 from "./scene2/createStartScene";
import createScene3 from "./scene3/createStartScene";
import createScene4 from "./scene4/createStartScene";

import { getHavok } from "./havok";
import { createCharacterController } from "./createCharacterController";
import { checkSceneTransition } from "./sceneTransitions";
import type { SceneData } from "./interfaces";

import "./main.css";

const canvas = document.createElement("canvas");
canvas.id = "renderCanvas";
canvas.width = 800;
canvas.height = 400;
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.minHeight = "100vh";
document.body.style.margin = "0";
document.body.appendChild(canvas);

const engine = new Engine(canvas, true, {}, true);

const scenes: SceneData[] = [];
let activeSceneIndex = 0;


function addPhysics(sd: SceneData, havok: any) {
  const scene = sd.scene;
  scene.enablePhysics(new Vector3(0, -18, 0), new HavokPlugin(true, havok));

  const solid = (name: string, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const box = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    box.position.set(x, y, z);
    box.isVisible = false;
    new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 0 }, scene);
  };

  solid("floor", 14, 1, 14, 0, -0.5, 0);
  solid("wallN", 16, 4, 1, 0, 2, 7.5);
  solid("wallS", 16, 4, 1, 0, 2, -7.5);
  solid("wallE", 1, 4, 16, 7.5, 2, 0);
  solid("wallW", 1, 4, 16, -7.5, 2, 0);
}

function updateSceneTransitions() {
  const current = scenes[activeSceneIndex];
  if (!current?.farmer) return;

  const t = checkSceneTransition(activeSceneIndex, current.farmer.position);
  if (!t) return;

  activeSceneIndex = t.destination;
  scenes[t.destination]?.teleportFarmer?.(t.spawnPosition);
}

async function main() {
  const havok = await getHavok();

  for (const create of [createScene1, createScene2, createScene3, createScene4]) {
    const sd = create(engine);
    addPhysics(sd, havok);

    (sd.camera as ArcRotateCamera).inputs.removeByType("ArcRotateCameraKeyboardMoveInput");

    await createCharacterController(sd);
    scenes.push(sd);
  }

  engine.runRenderLoop(() => {
    updateSceneTransitions();
    scenes[activeSceneIndex]?.scene.render();
  });

  window.addEventListener("resize", () => engine.resize());
}

main();