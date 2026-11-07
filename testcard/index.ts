import { Engine } from "@babylonjs/core";
import { createStartScene } from './createStartScene';
import { ShowInspector } from "@babylonjs/inspector";
import './main.css';

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

let eng = new Engine(canvas, true, {}, true);
let startScene = createStartScene(eng);
eng.runRenderLoop(() => {
    startScene.render();
});     
ShowInspector(startScene);