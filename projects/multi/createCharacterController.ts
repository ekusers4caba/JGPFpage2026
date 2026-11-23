import "@babylonjs/loaders/glTF/2.0";

import {
  Scene,
  Vector3,
  MeshBuilder,
  PhysicsCharacterController,
  Quaternion,
  CharacterSupportedState,
  KeyboardEventTypes,
  StandardMaterial,
  Color3,
  SceneLoader,
  TransformNode,
} from "@babylonjs/core";

import type { SceneData } from "./interfaces";

export async function createCharacterController(sceneData: SceneData) {
  const scene = sceneData.scene;

  if (!scene.getPhysicsEngine()) {
    throw new Error(
      "Physics must be enabled before creating the character controller."
    );
  }

  // Character settings
  const capsuleHeight = 1.8;
  const capsuleRadius = 0.35;
  const moveSpeed = 5.5;
  const airSpeed = 3.5;
  const jumpHeight = 1.5;

  const gravity = new Vector3(0, -18, 0);
  const up = new Vector3(0, 1, 0);

  // Starting position
  const startPosition = new Vector3(
    0,
    capsuleHeight / 2,
    0
  );

  // Create character collider
  const displayCapsule = MeshBuilder.CreateCapsule(
    "CharacterColliderDebug",
    {
      height: capsuleHeight,
      radius: capsuleRadius,
    },
    scene
  );

  displayCapsule.position.copyFrom(startPosition);
  displayCapsule.isVisible = false;

  const debugMaterial = new StandardMaterial(
    "characterDebugMaterial",
    scene
  );

  debugMaterial.diffuseColor = new Color3(0.8, 0.2, 0.2);
  displayCapsule.material = debugMaterial;

  // Create physics character controller
  const controller = new PhysicsCharacterController(
    startPosition.clone(),
    {
      capsuleHeight,
      capsuleRadius,
    },
    scene
  );

  // Allow scene transitions to reposition the farmer.
(sceneData as any).teleportFarmer = (position: Vector3) => {
  controller.setPosition(position);
  controller.setVelocity(Vector3.Zero());

  displayCapsule.position.copyFrom(position);

  farmerRoot.position.set(
    position.x,
    position.y - capsuleHeight / 2,
    position.z
  );
};

  // Load Farmer model
  const imported = await SceneLoader.ImportMeshAsync(
    "",
    "./assets/men/",
    "Farmer.gltf",
    scene
  );

  const farmerRoot = new TransformNode(
    "FarmerRoot",
    scene
  );

  for (const mesh of imported.meshes) {
    if (!mesh.parent) {
      mesh.parent = farmerRoot;
    }
  }

  farmerRoot.position.set(0, 0, 0);
  sceneData.farmer = farmerRoot;

  // Find animations
  sceneData.farmerIdleAnimation =
    imported.animationGroups.find(
      a => a.name === "Idle_Neutral"
    ) ??
    imported.animationGroups.find(
      a => a.name === "Idle"
    ) ??
    imported.animationGroups[0];

  sceneData.farmerWalkAnimation =
    imported.animationGroups.find(
      a => a.name === "Walk"
    ) ??
    imported.animationGroups.find(
      a => a.name === "Run"
    );

  // Stop all animations before starting idle
  for (const group of imported.animationGroups) {
    group.stop();
  }

  sceneData.farmerIdleAnimation?.start(true);

  // Keyboard input
  const keys = new Set<string>();
  let jumpRequested = false;
  let state = "ON_GROUND";

  const keyDown = (key: string) =>
    keys.has(key.toLowerCase());

  const keyboardObserver = scene.onKeyboardObservable.add(
    info => {
      const key = info.event.key.toLowerCase();

      if (info.type === KeyboardEventTypes.KEYDOWN) {
        keys.add(key);

        if (key === " " || key === "space") {
          jumpRequested = true;
        }
      }

      else if (info.type === KeyboardEventTypes.KEYUP) {
        keys.delete(key);
      }
    }
  );

  // Animation switching
  let activeAnimation = sceneData.farmerIdleAnimation;

  const setAnimation = (
    next: typeof activeAnimation
  ) => {
    if (!next || (next === activeAnimation && next.isPlaying)) {
      return;
    }

    activeAnimation?.stop();
    activeAnimation = next;
    activeAnimation.start(true);
  };

  // Main character update
  const renderObserver = scene.onBeforeRenderObservable.add(() => {

    const dt = Math.min(
      scene.getEngine().getDeltaTime() / 1000,
      1 / 30
    );

    if (dt <= 0) return;

    // Check ground support
    const down = new Vector3(0, -1, 0);

    const support = controller.checkSupport(
      dt,
      down
    );

    if (
      support.supportedState ===
      CharacterSupportedState.SUPPORTED
    ) {
      state = "ON_GROUND";
    }

    else if (state !== "START_JUMP") {
      state = "IN_AIR";
    }

    // Movement input
    let x =
      (keyDown("d") || keyDown("arrowright") ? 1 : 0) -
      (keyDown("a") || keyDown("arrowleft") ? 1 : 0);

    let z =
      (keyDown("w") || keyDown("arrowup") ? 1 : 0) -
      (keyDown("s") || keyDown("arrowdown") ? 1 : 0);

    // Normalise diagonal movement
    const inputLength = Math.hypot(x, z);

    if (inputLength > 1) {
      x /= inputLength;
      z /= inputLength;
    }

    const desired = new Vector3(
      x * moveSpeed,
      0,
      z * moveSpeed
    );

    const currentVelocity = controller.getVelocity();
    const forward = new Vector3(0, 0, 1);

    // Jump transition
    if (state === "ON_GROUND" && jumpRequested) {
      state = "START_JUMP";
    }

    let nextVelocity: Vector3;

    if (state === "START_JUMP") {

      const jumpSpeed = Math.sqrt(
        2 * gravity.length() * jumpHeight
      );

      nextVelocity = currentVelocity.clone();
      nextVelocity.y = jumpSpeed;

      state = "IN_AIR";
      jumpRequested = false;
    }

    else if (state === "IN_AIR") {

      const airDesired = desired.scale(
        airSpeed / moveSpeed
      );

      nextVelocity = controller.calculateMovement(
        dt,
        forward,
        up,
        currentVelocity,
        Vector3.Zero(),
        airDesired,
        up
      );

      nextVelocity.y =
        currentVelocity.y + gravity.y * dt;
    }

    else {

      nextVelocity = controller.calculateMovement(
        dt,
        forward,
        support.averageSurfaceNormal,
        currentVelocity,
        support.averageSurfaceVelocity,
        desired,
        up
      );

      nextVelocity.y = currentVelocity.y;
    }

    // Apply movement
    controller.setVelocity(nextVelocity);

    controller.integrate(
      dt,
      support,
      gravity
    );

    // Update player position
    const position = controller.getPosition();

    displayCapsule.position.copyFrom(position);

    farmerRoot.position.set(
      position.x,
      position.y - capsuleHeight / 2,
      position.z
    );

    // Character animation
    const velocity = controller.getVelocity();

    const horizontalSpeedSq =
      velocity.x * velocity.x +
      velocity.z * velocity.z;

    const moving = horizontalSpeedSq > 0.04;

    setAnimation(
      moving
        ? sceneData.farmerWalkAnimation
        : sceneData.farmerIdleAnimation
    );

    // Rotate character towards movement direction
    if (moving) {
      farmerRoot.rotationQuaternion =
        Quaternion.RotationYawPitchRoll(
          Math.atan2(velocity.x, velocity.z),
          0,
          0
        );
    }
  });

  // Cleanup references
  (scene as any).metadata = {
    ...(scene.metadata ?? {}),

    characterControllerCleanup: () => {
      scene.onKeyboardObservable.remove(keyboardObserver);

      scene.onBeforeRenderObservable.remove(renderObserver);

      controller.dispose();
      displayCapsule.dispose();

      farmerRoot.dispose(false, true);

      imported.animationGroups.forEach(
        group => group.dispose()
      );
    },
  };
}