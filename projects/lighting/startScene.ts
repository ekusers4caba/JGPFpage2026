import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  Color3,
  HemisphericLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  ShadowGenerator
} from "@babylonjs/core";

function createBox(scene: Scene) {
  let box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
  box.position.y = 3;
  return box;
}

function createHemisphericLight(scene: Scene) {
  const light: HemisphericLight = new HemisphericLight(
    "light",
    new Vector3(0, 1, 0),
    scene,
  );
  light.intensity = 0.3;
  light.diffuse = new Color3(1, 0, 0);
  light.specular = new Color3(0, 1, 0);
  light.groundColor = new Color3(0, 1, 0);
  return light;
}

function createDirectionalLight(scene: Scene) {
  const light = new DirectionalLight("light", new Vector3(0.2, -1, 0.2), scene);
  light.position = new Vector3(20, 40, 10);
  light.intensity = 0.5;
  light.diffuse = new Color3(0, 0.6, 0.5);
  light.specular = new Color3(0, 0.7, 0.3);
  return light;
}

function createPointLight(scene: Scene ){
    const light = new PointLight("light", new Vector3(-3, -3, 0.5),scene);
    light.intensity = 0.3;
    light.diffuse = new Color3(0.5, 1, 1);
    light.specular = new Color3(0.8, 1, 1);
    return light;
}

function createSpotLight(scene: Scene ){
    const light = new SpotLight("light", new Vector3(2, 1, -3), 
        new Vector3(0, -2, 3), Math.PI / 3, 20, scene);
    light.intensity = 1.0;
    light.diffuse = new Color3(1, 0, 0);
    light.specular = new Color3(0, 1, 0);
    return light;
}

function createShadows(light: DirectionalLight, sphere: Mesh ,box: Mesh){
    const shadower = new ShadowGenerator(1024, light);
    const sm : any = shadower.getShadowMap();
    sm.renderList.push(sphere, box);

    shadower.setDarkness(0.2);
    shadower.useBlurExponentialShadowMap = true;
    shadower.blurScale = 4;
    shadower.blurBoxOffset = 1;
    shadower.useKernelBlur = true;
    shadower.blurKernel = 64;
    shadower.bias = 0;
    return shadower;
}

function createSphere(scene: Scene) {
  let sphere = MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 2, segments: 32 },
    scene,
  );
  sphere.position.y = 1;
  return sphere;
}

function createGround(scene: Scene){
    let ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    var groundMaterial = new StandardMaterial("groundMaterial", scene);
    groundMaterial.backFaceCulling = false;
    ground.material = groundMaterial;
    ground.receiveShadows = true;
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
    scene,
  );
  camera.attachControl(true);
  return camera;
}

export function createStartScene(engine: Engine) {
  let myscene: Scene = new Scene(engine);
  let box = createBox(myscene);
  createHemisphericLight(myscene);
  createPointLight(myscene);
  createSpotLight(myscene);
  let dl = createDirectionalLight(myscene);
  let sphere = createSphere(myscene);
  createGround(myscene);
  createArcRotateCamera(myscene);
  createShadows(dl,sphere,box)

  return myscene;
}