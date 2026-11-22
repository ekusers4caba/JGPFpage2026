//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import { getHavok } from "./havok";
import {
  Scene,
  ArcRotateCamera,
  AssetsManager,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Engine,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
  Color3,
  StandardMaterial,
  Texture,
  AbstractMesh,
  MeshAssetTask,
  TransformNode,
} from "@babylonjs/core";
import type { SceneData } from "./interfaces";


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
  return groundAggregate;
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

function createBox1(scene: Scene) {
  let box = MeshBuilder.CreateBox("box", { width: 1, height: 1 }, scene);
  box.position.x = -1;
  box.position.y = 3;
  box.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture(
    "./assets/textures/wood.jpg",
    scene
  );
  texture.diffuseColor = new Color3(1, 1, 1);
  box.material = texture;
  new PhysicsAggregate(box, PhysicsShapeType.BOX, {mass: 0.2, restitution:0.1, friction:0.4}, scene);
  return box;

}

function createBox2(scene: Scene) {
  let box = MeshBuilder.CreateBox("box", { width: 1, height: 1 }, scene);
  box.position.x = -0.7;
  box.position.y = 5;
  box.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture(
    "./assets/textures/wood.jpg",
    scene
  );
  texture.diffuseColor = new Color3(1, 1, 1);
  box.material = texture;
  new PhysicsAggregate(box, PhysicsShapeType.BOX, {mass: 0.2, restitution:0.1, friction:0.4}, scene);
  return box;
}

function mergeAndAggregate(mesh: AbstractMesh[], scene: Scene) {
  // Filter meshes with geometry
  const meshesWithGeometry = mesh.filter(
    (m): m is Mesh => m instanceof Mesh && m.getTotalVertices() > 0
  );

  if (meshesWithGeometry.length > 0) {
    // MergeMeshes bakes world transforms into vertices, so merged mesh stays at origin
    const mergedMesh = Mesh.MergeMeshes(meshesWithGeometry, true, true, undefined, false, true);
    if (mergedMesh) {
      // Position is already baked into vertices - don't transform again
      new PhysicsAggregate(mergedMesh, PhysicsShapeType.MESH, { mass: 0 }, scene);
    }
  }
}

function addAssets(scene: Scene, sceneData: SceneData) {
  // add fixed scene objects here (mass 0)
  const assetsManager = new AssetsManager(scene);
  const tree1 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_1.gltf"
  );
  tree1.onSuccess = function (task) {
    const root = task.loadedMeshes[0];
    const tree1Clone = root!.clone("tree1_clone", null);
    // tree1
    root!.position = new Vector3(5, 0, 2);
    root!.scaling = new Vector3(0.9, 0.9, 0.9);
    mergeAndAggregate(task.loadedMeshes, scene );
    // Cloned tree1
    tree1Clone!.position = new Vector3(0, 0, 6);
    tree1Clone!.scaling = new Vector3(0.8, 0.8, 0.8);
    // Get clone and all its child meshes as an array
    const cloneMeshes = [tree1Clone!, ...tree1Clone!.getChildMeshes()];
    mergeAndAggregate(cloneMeshes, scene);
    
  };

 
  const tree2 = assetsManager.addMeshTask(
    "tree2 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_2.gltf"
  );
  tree2.onSuccess = function (task) {
    const root = task.loadedMeshes[0];
    const tree2Clone = root!.clone("tree1_clone", null);
    root!.position = new Vector3(0, 0, 2);
    root!.scaling = new Vector3(0.85, 0.85, 0.85);
    mergeAndAggregate(task.loadedMeshes, scene );
    // Cloned tree2
    tree2Clone!.position = new Vector3(-5, 0, 6);
    tree2Clone!.scaling = new Vector3(0.9, 0.9, 0.9);
        // Get clone and all its child meshes as an array
    const cloneMeshes = [tree2Clone!, ...tree2Clone!.getChildMeshes()];
    mergeAndAggregate(cloneMeshes, scene);
  };

  const tree3 = assetsManager.addMeshTask(
    "tree3 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_3.gltf"
  );
  tree3.onSuccess = function (task) {
    const root = task.loadedMeshes[0];
    const tree3Clone = root!.clone("tree3_clone", null);
    root!.position = new Vector3(-5, 0, 2);
    root!.scaling = new Vector3(0.9, 0.9, 0.9);
    mergeAndAggregate(task.loadedMeshes, scene );
    // Cloned tree3
    tree3Clone!.position = new Vector3(5, 0, 6);
    tree3Clone!.scaling = new Vector3(0.75, 0.75, 0.75);
           // Get clone and all its child meshes as an array
    const cloneMeshes = [tree3Clone!, ...tree3Clone!.getChildMeshes()];
    mergeAndAggregate(cloneMeshes, scene); 
  };

  const farmer:MeshAssetTask = assetsManager.addMeshTask(
    "farmer task",
    "",
    "./assets/men/",
    "Farmer.gltf"
  );
  farmer.onSuccess = function (task) {
    const root = task.loadedMeshes[0];
    const farmerPivot = new TransformNode("farmer-pivot", scene);
    root!.parent = farmerPivot;
    sceneData.farmer = farmerPivot;
    sceneData.farmerIdleAnimation = task.loadedAnimationGroups.find(
      (animationGroup) => animationGroup.name === "Idle"
    );
    sceneData.farmerWalkAnimation = task.loadedAnimationGroups.find(
      (animationGroup) => animationGroup.name === "Walk"
    );
    sceneData.farmerIdleAnimation?.start(true);
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
    ground?: PhysicsAggregate;
    camera?: ArcRotateCamera;
    box1?:Mesh;
    box2?:Mesh;
  }  
  
  const that: SceneData = { scene: new Scene(engine) };

    const hk = await getHavok();
    that.scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, hk));
  
  //that.scene.debugLayer.show();

  that.light = createLight(that.scene);
  that.ground = createGround(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  that.box1 = createBox1(that.scene);
  that.box2 = createBox2(that.scene);
  const assetsManager = addAssets(that.scene, that);
  assetsManager.load();
  return that;
}