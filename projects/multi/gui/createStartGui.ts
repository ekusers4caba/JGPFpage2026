import {
  Scene,
  ArcRotateCamera,
  Vector3,
  Engine,
} from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

import { type GuiData } from "../interfaces";
import setSceneIndex from "./../index";

function createSceneButton(
  scene: Scene,
  name: string,
  note: string,
  index: number,
  x: string,
  y: string,
  advtex: GUI.AdvancedDynamicTexture,
) {
  let button = GUI.Button.CreateSimpleButton(name, note);
  button.left = x;
  button.top = y;
  button.width = "80px";
  button.height = "30px";
  button.color = "white";
  button.cornerRadius = 20;
  button.background = "purple";

  button.onPointerUpObservable.add(function () {
    console.log("Button {index} has been clicked");
    setSceneIndex(index - 1);
  });
  advtex.addControl(button);
  return button;
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
  camera.attachControl(false);
  return camera;
}

export default function createStartGui(engine: Engine) {
  let guiData: GuiData = { scene: new Scene(engine) };
  guiData.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    "myUI",
    true,
  );
  guiData.button1 = createSceneButton(
    guiData.scene,
    "but1",
    "1",
    1,
    "-150px",
    "120px",
    guiData.advancedTexture,
  );
  guiData.button2 = createSceneButton(
    guiData.scene,
    "but2",
    "2",
    2,
    "-50px",
    "120px",
    guiData.advancedTexture,
  );
  guiData.button3 = createSceneButton(
    guiData.scene,
    "but3",
    "3",
    3,
    "50px",
    "120px",
    guiData.advancedTexture,
  );
  guiData.button4 = createSceneButton(
    guiData.scene,
    "but4",
    "4",
    4,
    "150px",
    "120px",
    guiData.advancedTexture,
  );
  guiData.camera = createArcRotateCamera(guiData.scene);

  return guiData;
}