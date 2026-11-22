//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF/2.0";
import { getHavok } from "./havok";
import {
  Scene,
  ArcRotateCamera,
  AssetsManager,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Camera,
  Engine,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
} from "@babylonjs/core";



function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  return light;
}

function createGround(scene: Scene) {
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 16, height: 16 },
    scene
  );
// Create a static box shape.
  let groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
  return ground;
}

function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 10,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.attachControl(true);
  return camera;
}

function addAssets(scene: Scene) {
  // add assets here
  const assetsManager = new AssetsManager(scene);
  const tree1 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_1.gltf"
  );
  tree1.onSuccess = function (task) {
    task.loadedMeshes[0]!.position = new Vector3(3, 0, 2);
    task.loadedMeshes[0]!.scaling = new Vector3(0.5, 0.5, 0.5);
    // Clone tree1
    const tree1Clone = task.loadedMeshes[0]!.clone("tree1_clone", null);
    tree1Clone!.position = new Vector3(0, 0, 5);
  };

  const tree2 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_2.gltf"
  );
  tree2.onSuccess = function (task) {
    task.loadedMeshes[0]!.position = new Vector3(0, 0, 2);
    task.loadedMeshes[0]!.scaling = new Vector3(0.5, 0.5, 0.5);
    // Clone tree2
    const tree2Clone = task.loadedMeshes[0]!.clone("tree2_clone", null);
    tree2Clone!.position = new Vector3(-3, 0, 5);
  };

  const tree3 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_3.gltf"
  );
  tree3.onSuccess = function (task) {
    task.loadedMeshes[0]!.position = new Vector3(-3, 0, 2);
    task.loadedMeshes[0]!.scaling = new Vector3(0.5, 0.5, 0.5);
    // Clone tree3
    const tree3Clone = task.loadedMeshes[0]!.clone("tree3_clone", null);
    tree3Clone!.position = new Vector3(3, 0, 5);
  };

  assetsManager.onTaskErrorObservable.add(function (task) {
    console.log(
      "task failed",
      task.errorObject.message,
      task.errorObject.exception
    );
  });
  return assetsManager;
}


export default async function createStartScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
    light?: HemisphericLight;
    ground?: Mesh;
    camera?: Camera;
  }

  let that: SceneData = { scene: new Scene(engine) };

  const hk = await getHavok();
  that.scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, hk));

  //that.scene.debugLayer.show();

  that.light = createLight(that.scene);
  that.ground = createGround(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  const assetsManager = addAssets(that.scene);
  assetsManager.load();
  return that;
}