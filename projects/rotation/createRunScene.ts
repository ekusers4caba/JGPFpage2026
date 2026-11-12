import { Vector3, Quaternion } from "@babylonjs/core";

import { SceneData } from "./interfaces";

// rotate box
let boxAngle: number = 0.3;
let boxSpeed: number = 0.01;

// move light in ellipse and cycle luma
let lightAngle: number = 0;
let lightSpeed: number = 0.005;
const lightXpos: number = 1;
const lightZpos: number = 5;

// vertical oscilation of meshes
let verticalSpeed: number = 0.006;
let verticalAngle: number = 0;
let verticalRangeY: number = 0.3;
let boxPositionY: number = 4;
let spherePositionY: number = 1.5;

export default function createRunScene(runScene: SceneData) {
  runScene.scene.onAfterRenderObservable.add(() => {
    // rotate box
    const axis: Vector3 = new Vector3(0, 0, 1).normalize();
    const quat: Quaternion = Quaternion.RotationAxis(
      axis,
      boxAngle * 2 * Math.PI
    );
    runScene.box.rotationQuaternion = quat;
    boxAngle += boxSpeed;
    boxAngle %= 1;

    // move light in ellipse  and cycle luma
    runScene.lightSpot.position = new Vector3(
      lightXpos + 8 * Math.sin(lightAngle * 2 * Math.PI),
      20,
      lightZpos + 10 * Math.cos(lightAngle * 2 * Math.PI)
    );
    runScene.lightSpot.intensity = 0.7 * Math.sin(lightAngle * 2 * Math.PI);
    lightAngle += lightSpeed;
    lightAngle %= 1;

    // vertical oscilation of meshes
    runScene.box.position.y =
      boxPositionY + verticalRangeY * Math.sin(verticalAngle * 2 * Math.PI);
    runScene.sphere.position.y =
      spherePositionY - verticalRangeY * Math.sin(verticalAngle * 2 * Math.PI);
    verticalAngle += verticalSpeed;
    verticalAngle %= 1;
  });
}