import {
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Engine,
  StandardMaterial,
  Texture,
  Color3,
} from "@babylonjs/core";

import { type SceneData } from "../interfaces";

function createCylinder(scene: Scene) {
  let cylinder = MeshBuilder.CreateCylinder(
    "cylinder",
    { height: 1, diameter: 0.7 },
    scene,
  );
  cylinder.position.x = 1;
  cylinder.position.y = 1;
  cylinder.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./assets/reflectivity.png", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  cylinder.material = texture;
  return cylinder;
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

  sceneData.cylinder = createCylinder(sceneData.scene);
  sceneData.light = createLight(sceneData.scene);
  sceneData.sphere = createSphere(sceneData.scene);
  sceneData.ground = createGround(sceneData.scene);
  sceneData.camera = createArcRotateCamera(sceneData.scene);
  return sceneData;
}