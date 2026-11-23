
import "@babylonjs/loaders/glTF/2.0";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Engine,
  AssetsManager,
  StandardMaterial,
  Color3,
  Mesh,
} from "@babylonjs/core";

import { type SceneData } from "../interfaces";

function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.85;
  return light;
}

function createGround(scene: Scene, groundColour: Color3) {
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 14, height: 14 },
    scene,
  );

  const groundMaterial = new StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = groundColour;
  groundMaterial.specularColor = new Color3(0.05, 0.05, 0.05);
  ground.material = groundMaterial;
  return ground;
}

function createArcRotateCamera(scene: Scene) {
  const camera = new ArcRotateCamera(
    "camera1",
    -Math.PI / 2,
    Math.PI / 2.7,
    14,
    new Vector3(0, 1, 0),
    scene,
  );
  camera.attachControl(true);
  return camera;
}

function addAsset(
  assetsManager: AssetsManager,
  fileName: string,
  positions: Vector3[],
  scale: number,
) {
  const task = assetsManager.addMeshTask(
    `${fileName} task`,
    "",
    "./assets/nature/glTF/",
    `${fileName}.gltf`,
  );

  task.onSuccess = (task) => {
    const original = task.loadedMeshes[0];
    if (!original) return;

    original.position = positions[0]!.clone();
    original.scaling = new Vector3(scale, scale, scale);

    for (let i = 1; i < positions.length; i++) {
      const copy = original.clone(`${fileName}_${i}`, null);
      if (copy) copy.position = positions[i]!.clone();
    }
  };
}

function loadEnvironment(scene: Scene, setup: (manager: AssetsManager) => void) {
  const assetsManager = new AssetsManager(scene);
  setup(assetsManager);

  assetsManager.onTaskErrorObservable.add((task) => {
    console.error(
      `Could not load asset: ${task.name}`,
      task.errorObject.message,
    );
  });

  assetsManager.load();
}

export default function createStartScene(engine: Engine) {
  const sceneData: SceneData = { scene: new Scene(engine) };

  sceneData.light = createLight(sceneData.scene);
  sceneData.ground = createGround(
    sceneData.scene,
    new Color3(0.32, 0.38, 0.24),
  );
  sceneData.camera = createArcRotateCamera(sceneData.scene);

  loadEnvironment(sceneData.scene, (assets) => {
    addAsset(assets, "TwistedTree_1", [
      new Vector3(-5, 0, -4),
      new Vector3(5, 0, 4),
    ], 0.6);

    addAsset(assets, "CommonTree_5", [
      new Vector3(5, 0, -4),
      new Vector3(-5, 0, 4),
    ], 0.55);

    addAsset(assets, "Bush_Common_Flowers", [
      new Vector3(-3.6, 0, -1.5),
      new Vector3(3.6, 0, 1.5),
    ], 0.85);

    addAsset(assets, "Flower_4_Group", [
      new Vector3(-2.5, 0, 2),
      new Vector3(2.5, 0, -2),
      new Vector3(-3.5, 0, 3.5),
      new Vector3(3.5, 0, -3.5),
    ], 0.8);

    addAsset(assets, "Plant_1_Big", [
      new Vector3(-4, 0, 1),
      new Vector3(4, 0, -1),
    ], 0.75);

    addAsset(assets, "RockPath_Square_Wide", [
      new Vector3(-2, 0, 3.7),
      new Vector3(-1, 0, 3.7),
      new Vector3(0, 0, 3.7),
      new Vector3(1, 0, 3.7),
      new Vector3(2, 0, 3.7),
    ], 0.7);

    addAsset(assets, "Grass_Wispy_Tall", [
      new Vector3(-4, 0, -2.5),
      new Vector3(4, 0, 2.5),
    ], 0.7);
  });

  return sceneData;
}
