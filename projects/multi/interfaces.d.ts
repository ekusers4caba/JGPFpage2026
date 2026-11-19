import {
  Scene,
  Mesh,
  HemisphericLight,
  Camera,
} from "@babylonjs/core";

import {
  AdvancedDynamicTexture,
  Button,
} from "@babylonjs/gui";

export interface SceneData {
      scene:     Scene;
      light?:    HemisphericLight;
      ground?:   Mesh;
      cylinder?: Mesh;
      sphere?:   Mesh;
      box?:      Mesh
      torus?:    Mesh;
      tube?:     Mesh; 
      camera?:   Camera;
}

export interface GuiData {
      scene: Scene;
      advancedTexture?: AdvancedDynamicTexture;
      button1?: Button;
      button2?: Button;
      button3?: Button;
      button4?: Button;
      camera?: Camera;
}