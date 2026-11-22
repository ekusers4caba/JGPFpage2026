import {
  Scene,
  Mesh,
  HemisphericLight,
  Camera,
  PhysicsAggregate,
} from "@babylonjs/core";

export interface SceneData {
      scene: Scene;
      light?: HemisphericLight;
      ground?: PhysicsAggregate;
      camera?: Camera;
      box1?:Mesh;
      box2?:Mesh;
}