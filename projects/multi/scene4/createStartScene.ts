import {
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Engine,
  Texture,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";

import { type SceneData } from "../interfaces";

function createTube(scene: Scene) {
  const myPath = [new Vector3(1.85, 0.85, 0.85), new Vector3(1.35, 0.35, 0.35)];

  const tube = MeshBuilder.CreateTube(
    "tube",
    { path: myPath, radius: 0.4, sideOrientation: Mesh.DOUBLESIDE },
    scene,
  );

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./assets/reflectivity.png", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  tube.material = texture;
  return tube;
}

function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  return light;
}

function createSphere(scene: Scene) {
  let sphere = MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 2, segments: 32 },
    scene,
  );
  sphere.position.y = 1;
  return sphere;
}

function createGround(scene: Scene) {
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 6 },
    scene,
  );
  return ground;
}

function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 10,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene,
  );
  camera.attachControl(true);
  return camera;
}

export default function createStartScene(engine: Engine) {
  let sceneData: SceneData = { scene: new Scene(engine) };

  sceneData.tube = createTube(sceneData.scene);
  sceneData.light = createLight(sceneData.scene);
  sceneData.sphere = createSphere(sceneData.scene);
  sceneData.ground = createGround(sceneData.scene);
  sceneData.camera = createArcRotateCamera(sceneData.scene);
  return sceneData;
}