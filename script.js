
const pages = document.querySelectorAll(".page");
const canvas = document.getElementById("renderCanvas");

let engine = new BABYLON.Engine(canvas, true);
let currentScene = null;

// Switch between website pages
function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

    // Load a Babylon scene if selected
    if (pageId.startsWith("scene")) {
        loadScene(pageId);
    } else {
        disposeScene();
    }
}

// Remove the previous Babylon scene
function disposeScene() {

    if (currentScene) {
        currentScene.dispose();
        currentScene = null;
    }
}

// Create a Babylon scene
function loadScene(sceneName) {

    disposeScene();

    currentScene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 3,
        8,
        BABYLON.Vector3.Zero(),
        currentScene
    );

    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        currentScene
    );

    // Create an example object
    const sphere = BABYLON.MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 2 },
        currentScene
    );

    // Give each scene a different object colour
    const material = new BABYLON.StandardMaterial(
        "material",
        currentScene
    );

    const colours = {
        scene1: new BABYLON.Color3(1, 0, 0),
        scene2: new BABYLON.Color3(0, 1, 0),
        scene3: new BABYLON.Color3(0, 0, 1),
        scene4: new BABYLON.Color3(1, 1, 0),
        scene5: new BABYLON.Color3(1, 0, 1)
    };

    material.diffuseColor = colours[sceneName];

    sphere.material = material;

    // Render the selected scene
    engine.runRenderLoop(() => {
        if (currentScene) {
            currentScene.render();
        }
    });
}

// Resize Babylon canvas when window changes
window.addEventListener("resize", () => {
    engine.resize();
});
