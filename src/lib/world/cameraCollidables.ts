import * as THREE from "three";

const collidables: THREE.Object3D[] = [];

/** Call on mount to make an object block the camera. Returns the unregister function. */
export function registerCameraCollidable(object: THREE.Object3D): () => void {
  collidables.push(object);
  return () => {
    const idx = collidables.indexOf(object);
    if (idx !== -1) collidables.splice(idx, 1);
  };
}

export function getCameraCollidables(): THREE.Object3D[] {
  return collidables;
}
