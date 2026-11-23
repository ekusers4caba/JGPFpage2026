import { Scene, Mesh, HemisphericLight, Camera, AnimationGroup, TransformNode, Vector3 } from "@babylonjs/core";

export interface SceneData {
  scene: Scene;
  light?: HemisphericLight;
  ground?: Mesh;
  camera?: Camera;

  // Player
  farmer?: TransformNode;
  teleportFarmer?: (position: Vector3) => void;
  farmerIdleAnimation?: AnimationGroup;
  farmerWalkAnimation?: AnimationGroup;
}