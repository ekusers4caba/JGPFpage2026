import { Engine} from "@babylonjs/core";
import createScene1  from "./scene1/createStartScene";
import createScene2  from "./scene2/createStartScene";
import createScene3  from "./scene3/createStartScene";
import createScene4  from "./scene4/createStartScene";
import createGui     from "./gui/createStartGui";
import "./main.css";


const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;
canvas.width = 800;   // Set internal resolution
canvas.height = 400;

canvas.classList.add("background-canvas");
document.body.style.display = "flex";
document.body.style.justifyContent = "center"; // Horizontal centering
document.body.style.alignItems = "center";     // Vertical centering
document.body.style.minHeight = "100vh";       // Use full viewport height
document.body.style.margin = "0"; 
document.body.appendChild(canvas);

let scene;
let scenes: any[] = [];

let eng = new Engine(canvas, true, {}, true);
let gui = createGui(eng);

(async function main(){
scenes[0] = createScene1(eng);
scenes[1] = createScene2(eng);
scenes[2] = createScene3(eng);
scenes[3] = createScene4(eng);
setSceneIndex(0);
})();

export default function setSceneIndex(i: number) {
  console.log("Switching to scene index:", i, scenes[i]);
  eng.stopRenderLoop();
  eng.runRenderLoop(() => {
      scenes[i].scene.render();
      gui.scene.autoClear = false;
      gui.scene.render();
  });
}   