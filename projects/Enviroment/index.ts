
import { Engine } from "@babylonjs/core";

import createStartScene from "./createStartScene";
import createRunScene from "./createRunScene";

import "./main.css";

const CanvasName = "renderCanvas";

// Create canvas
const canvas = document.createElement("canvas");

canvas.id = CanvasName;
canvas.width = 800;
canvas.height = 400;

canvas.classList.add("background-canvas");

// Centre the canvas
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.minHeight = "100vh";
document.body.style.margin = "0";

document.body.appendChild(canvas);

// Create Babylon engine
const eng = new Engine(canvas, true, {}, true);

// Create scene
const startScene = createStartScene(eng);

// Add scene behaviour
createRunScene(startScene);

// Render loop
eng.runRenderLoop(() => {
    startScene.scene.render();
});

// Resize canvas when window changes
window.addEventListener("resize", () => {
    eng.resize();
});
