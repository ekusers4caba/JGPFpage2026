
import HavokPhysics from "@babylonjs/havok";

export async function getHavok() {
  return await HavokPhysics({
    locateFile: (file: string) => {
      if (file.endsWith(".wasm")) {
        return "https://cdn.babylonjs.com/havok/HavokPhysics.wasm";
      }

      return file;
    },
  });
}
