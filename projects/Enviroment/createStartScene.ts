
import type { SceneData } from "./interfaces";

import {
    ArcRotateCamera,
    Color3,
    CreateAudioEngineAsync,
    CreateStreamingSoundAsync,
    CubeTexture,
    Engine,
    HemisphericLight,
    InstancedMesh,
    Mesh,
    MeshBuilder,
    Scene,
    Sprite,
    SpriteManager,
    StandardMaterial,
    Texture,
    Vector3,
    Vector4
} from "@babylonjs/core";

import {
    AdvancedDynamicTexture,
    Button,
    Control
} from "@babylonjs/gui";


// ======================================
// 1. CREATE TERRAIN
// ======================================

function createTerrain(scene: Scene) {

    const largeGroundMat = new StandardMaterial(
        "largeGroundMat",
        scene
    );

    largeGroundMat.diffuseTexture = new Texture(
        "./assets/enviroments/valleygrass.png",
        scene
    );

    const largeGround = MeshBuilder.CreateGroundFromHeightMap(
        "largeGround",
        "./assets/enviroments/villageheightmap.png",
        {
            width: 150,
            height: 150,
            subdivisions: 100,
            minHeight: 0,
            maxHeight: 10
        },
        scene
    );

    largeGround.material = largeGroundMat;

    largeGround.position.y = -0.01;

    return largeGround;
}


// ======================================
// 2. CREATE CENTRAL GROUND
// ======================================

function createGround(scene: Scene) {

    const groundMaterial = new StandardMaterial(
        "groundMaterial",
        scene
    );

    groundMaterial.diffuseTexture = new Texture(
        "./assets/enviroments/villagegreen.png",
        scene
    );

    groundMaterial.diffuseTexture.hasAlpha = true;

    groundMaterial.backFaceCulling = false;

    const ground = MeshBuilder.CreateGround(
        "ground",
        {
            width: 24,
            height: 24
        },
        scene
    );

    ground.material = groundMaterial;

    ground.position.y = 0.01;

    return ground;
}


// ======================================
// 3. CREATE SKYBOX
// ======================================

function createSky(scene: Scene) {

    const skybox = MeshBuilder.CreateBox(
        "skyBox",
        {
            size: 150
        },
        scene
    );

    const skyboxMaterial = new StandardMaterial(
        "skyBoxMaterial",
        scene
    );

    skyboxMaterial.backFaceCulling = false;

    skyboxMaterial.reflectionTexture = new CubeTexture(
        "./assets/textures/skybox/skybox",
        scene
    );

    skyboxMaterial.reflectionTexture.coordinatesMode =
        Texture.SKYBOX_MODE;

    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);

    skyboxMaterial.specularColor = new Color3(0, 0, 0);

    skybox.material = skyboxMaterial;

    return skybox;
}


// ======================================
// 4. CREATE HOUSE BODY
// ======================================

function createBox(scene: Scene, style: number) {

    const boxMat = new StandardMaterial("boxMat", scene);

    const faceUV: Vector4[] = [];

    if (style === 1) {

        // Small detached house

        boxMat.diffuseTexture = new Texture(
            "./assets/textures/cubehouse.png",
            scene
        );

        faceUV[0] = new Vector4(0.5, 0, 0.75, 1);
        faceUV[1] = new Vector4(0, 0, 0.25, 1);
        faceUV[2] = new Vector4(0.25, 0, 0.5, 1);
        faceUV[3] = new Vector4(0.75, 0, 1, 1);

    } else {

        // Semi-detached house

        boxMat.diffuseTexture = new Texture(
            "./assets/textures/semihouse.png",
            scene
        );

        faceUV[0] = new Vector4(0.6, 0, 1, 1);
        faceUV[1] = new Vector4(0, 0, 0.4, 1);
        faceUV[2] = new Vector4(0.4, 0, 0.6, 1);
        faceUV[3] = new Vector4(0.4, 0, 0.6, 1);
    }

    const box = MeshBuilder.CreateBox(
        "box",
        {
            width: style,
            height: 1,
            depth: 1,
            faceUV: faceUV,
            wrap: true
        },
        scene
    );

    box.position = new Vector3(0, 0.5, 0);

    box.scaling = new Vector3(1, 1, 1);

    box.material = boxMat;

    return box;
}


// ======================================
// 5. CREATE ROOF
// ======================================

function createRoof(scene: Scene, style: number) {

    const roof = MeshBuilder.CreateCylinder(
        "roof",
        {
            diameter: 1.3,
            height: 1.2,
            tessellation: 3
        },
        scene
    );

    roof.scaling.x = 0.75;

    roof.scaling.y = style * 0.85;

    roof.rotation.z = Math.PI / 2;

    roof.position.y = 1.22;

    const roofMat = new StandardMaterial(
        "roofMat",
        scene
    );

    roofMat.diffuseTexture = new Texture(
        "./assets/textures/roof.jpg",
        scene
    );

    roof.material = roofMat;

    return roof;
}


// ======================================
// 6. CREATE COMPLETE HOUSE
// ======================================

function createHouse(scene: Scene, style: number) {

    const box = createBox(scene, style);

    const roof = createRoof(scene, style);

    const house = Mesh.MergeMeshes(
        [box, roof],
        true,
        false,
        undefined,
        false,
        true
    );

    return house;
}


// ======================================
// 7. CREATE VILLAGE HOUSES
// ======================================

function createHouses(scene: Scene, style: number) {

    // Style 1 = one small house
    if (style === 1) {

        createHouse(scene, 1);

    }

    // Style 2 = one semi-detached house
    if (style === 2) {

        createHouse(scene, 2);

    }

    // Style 3 = complete village estate
    if (style === 3) {

        const houses: Mesh[] = [];

        // First small house

        const house1 = createHouse(scene, 1);

        if (!house1) return;

        house1.rotation.y = -Math.PI / 16;

        house1.position.x = -6.8;

        house1.position.z = 2.5;

        houses[0] = house1;


        // First semi-detached house

        const house2 = createHouse(scene, 2);

        if (!house2) return;

        house2.rotation.y = -Math.PI / 16;

        house2.position.x = -4.5;

        house2.position.z = 3;

        houses[1] = house2;


        // House placement information
        // [house type, rotation, x position, z position]

        const places: number[][] = [

            [2, -Math.PI / 16, -1.5, 4],
            [2, -Math.PI / 3, 1.5, 6],
            [2, (15 * Math.PI) / 16, -6.4, -1.5],
            [1, (15 * Math.PI) / 16, -4.1, -1],
            [2, (15 * Math.PI) / 16, -2.1, -0.5],
            [1, (5 * Math.PI) / 4, 0, -1],
            [1, Math.PI + Math.PI / 2.5, 0.5, -3],
            [2, Math.PI + Math.PI / 2.1, 0.75, -5],
            [1, Math.PI + Math.PI / 2.25, 0.75, -7],
            [2, Math.PI / 1.9, 4.75, -1],
            [1, Math.PI / 1.95, 4.5, -3],
            [2, Math.PI / 1.9, 4.75, -5],
            [1, Math.PI / 1.9, 4.75, -7],
            [2, -Math.PI / 3, 5.25, 2],
            [1, -Math.PI / 3, 6, 4]

        ];


        // Create house instances

        const ihouses: InstancedMesh[] = [];

        for (let i = 0; i < places.length; i++) {

            const place = places[i]!;

            const houseType = place[0]!;
            const rotation = place[1]!;
            const x = place[2]!;
            const z = place[3]!;

            const sourceHouse =
                houseType === 1 ? houses[0]! : houses[1]!;

            const instance = sourceHouse.createInstance(
                "house" + i
            );

            instance.rotation.y = rotation;

            instance.position.x = x;

            instance.position.z = z;

            ihouses[i] = instance;

        }

    }

}


// ======================================
// 8. CREATE TREES
// ======================================

function createTrees(scene: Scene) {

    const spriteManagerTrees = new SpriteManager(
        "treesManager",
        "./assets/sprites/tree.png",
        1000,
        {
            width: 512,
            height: 1024
        },
        scene
    );


    // First group of trees

    for (let i = 0; i < 500; i++) {

        const tree = new Sprite(
            "tree",
            spriteManagerTrees
        );

        tree.position.x = Math.random() * -30;

        tree.position.z = Math.random() * 20 + 8;

        tree.position.y = 0.2;

    }


    // Second group of trees

    for (let i = 0; i < 500; i++) {

        const tree = new Sprite(
            "tree",
            spriteManagerTrees
        );

        tree.position.x = Math.random() * 25 + 7;

        tree.position.z = Math.random() * -35 + 8;

        tree.position.y = 0.2;

    }

}


// ======================================
// 9. CREATE HEMISPHERIC LIGHT
// ======================================

function createHemisphericLight(scene: Scene) {

    const light = new HemisphericLight(
        "light",
        new Vector3(2, 1, 0),
        scene
    );

    light.intensity = 0.8;

    light.diffuse = new Color3(1, 1, 1);

    light.specular = new Color3(1, 0.8, 0.8);

    light.groundColor = new Color3(0, 0.2, 0.7);

    return light;
}


// ======================================
// 10. INITIALISE BACKGROUND AUDIO
// ======================================

async function initializeAudio() {

    const audioEngine = await CreateAudioEngineAsync();

    await audioEngine.unlockAsync();

    const audioSound = await CreateStreamingSoundAsync(
        "birds",
        "./assets/audio/AMBBird.wav",
        {
            loop: true
        },
        audioEngine
    );

    return audioSound;
}


// ======================================
// 11. CREATE AUDIO BUTTON
// ======================================

function createAudioButton(scene: Scene) {

    const gui = AdvancedDynamicTexture.CreateFullscreenUI(
        "audioUI",
        true,
        scene
    );

    const button = Button.CreateSimpleButton(
        "audioButton",
        "🔇"
    );

    let audioSound:
        Awaited<ReturnType<typeof initializeAudio>> | null = null;

    let isAudioPlaying = false;

    button.width = "50px";

    button.height = "50px";

    button.cornerRadius = 25;

    button.color = "white";

    button.background = "#222";

    button.thickness = 0;

    button.fontSize = 24;

    button.horizontalAlignment =
        Control.HORIZONTAL_ALIGNMENT_RIGHT;

    button.verticalAlignment =
        Control.VERTICAL_ALIGNMENT_TOP;

    button.leftInPixels = -20;

    button.topInPixels = 20;


    button.onPointerUpObservable.add(async () => {

        button.isEnabled = false;

        try {

            if (!audioSound) {

                audioSound = await initializeAudio();

            }

            if (isAudioPlaying) {

                audioSound.pause();

                isAudioPlaying = false;

                button.textBlock!.text = "🔇";

            } else {

                audioSound.play();

                isAudioPlaying = true;

                button.textBlock!.text = "🔊";

            }

        } catch (error) {

            console.error(
                "Failed to toggle audio",
                error
            );

        } finally {

            button.isEnabled = true;

        }

    });

    gui.addControl(button);

}


// ======================================
// 12. CREATE ARC ROTATE CAMERA
// ======================================

function createArcRotateCamera(scene: Scene) {

    const camAlpha = -Math.PI / 2;

    const camBeta = Math.PI / 2.5;

    const camDist = 25;

    const camTarget = new Vector3(0, 0, 0);


    const camera = new ArcRotateCamera(
        "camera1",
        camAlpha,
        camBeta,
        camDist,
        camTarget,
        scene
    );


    // Camera movement restrictions

    camera.lowerRadiusLimit = 9;

    camera.upperRadiusLimit = 25;

    camera.lowerAlphaLimit = 0;

    camera.upperAlphaLimit = Math.PI * 2;

    camera.lowerBetaLimit = 0;

    camera.upperBetaLimit = Math.PI / 2.02;


    camera.attachControl(true);

    return camera;

}


// ======================================
// 13. CREATE COMPLETE SCENE
// ======================================

export default function createStartScene(engine: Engine) {

    const scene = new Scene(engine);


    // Create environment elements

    const ground = createGround(scene);

    const sky = createSky(scene);

    const lightHemispheric =
        createHemisphericLight(scene);


    // Create village

    createHouses(scene, 3);

    createTrees(scene);

    createTerrain(scene);


    // Create camera

    const camera = createArcRotateCamera(scene);


    // Add audio controls

    createAudioButton(scene);


    // Return scene data

    const that: SceneData = {

        scene,

        ground,

        sky,

        lightHemispheric,

        camera

    };


    return that;

}
