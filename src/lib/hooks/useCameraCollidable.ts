"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { registerCameraCollidable } from "@/lib/world/cameraCollidables";

/** Attach the returned ref to a mesh/group the camera should avoid clipping into. */
export function useCameraCollidable<T extends THREE.Object3D>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    return registerCameraCollidable(ref.current);
  }, []);

  return ref;
}
