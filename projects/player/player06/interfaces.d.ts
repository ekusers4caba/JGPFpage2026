import {
  Scene,
  Mesh,
  HemisphericLight,
  Camera,
  PhysicsAggregate,
  AnimationGroup,
  TransformNode,
} from "@babylonjs/core";

export interface SceneData {
      scene: Scene;
      light?: HemisphericLight;
      ground?: PhysicsAggregate;
      camera?: Camera;
      box1?:PhysicsAggregate;
      box2?:PhysicsAggregate;
      farmer?: TransformNode;
      farmerIdleAnimation?: AnimationGroup;
      farmerWalkAnimation?: AnimationGroup;
}