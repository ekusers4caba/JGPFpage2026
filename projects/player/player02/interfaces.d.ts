import {
  Scene,
  Mesh,
  HemisphericLight,
  Camera,
} from "@babylonjs/core";

export interface SceneData {
      scene: Scene;
      light?: HemisphericLight;
      ground?: Mesh;
      camera?: Camera;
}