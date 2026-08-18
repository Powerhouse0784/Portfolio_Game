import * as THREE from "three";

export type WindUniforms = {
  uTime: { value: number };
  uWindStrength: { value: number };
  uWindSpeed: { value: number };
};

type WindOptions = {
  /** How far vertices displace at maximum height. Small — this is a breeze, not a storm. */
  strength?: number;
  /** Sway cycle speed. */
  speed?: number;
};

/**
 * Mutates `material` in place, injecting a wind-sway vertex offset via
 * onBeforeCompile. Returns the uniforms object — update `uTime.value` from a
 * useFrame loop to animate. Works correctly with instancing: the displacement is
 * computed in local space (so it respects each instance's own rotation/scale via
 * the later instanceMatrix multiply), and the phase is offset by each instance's
 * world position so a whole field of trees doesn't sway in perfect unison.
 */
export function applyWindSway(
  material: THREE.MeshStandardMaterial,
  { strength = 0.06, speed = 1.1 }: WindOptions = {}
): WindUniforms {
  const uniforms: WindUniforms = {
    uTime: { value: 0 },
    uWindStrength: { value: strength },
    uWindSpeed: { value: speed },
  };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uWindStrength = uniforms.uWindStrength;
    shader.uniforms.uWindSpeed = uniforms.uWindSpeed;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      uniform float uTime;
      uniform float uWindStrength;
      uniform float uWindSpeed;`
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
      #ifdef USE_INSTANCING
        vec3 windInstancePos = instanceMatrix[3].xyz;
      #else
        vec3 windInstancePos = vec3(0.0);
      #endif
      float windHeight = max(position.y, 0.0);
      float windPhase = uTime * uWindSpeed + windInstancePos.x * 0.5 + windInstancePos.z * 0.5;
      float windSway = sin(windPhase) * uWindStrength * windHeight;
      transformed.x += windSway;
      transformed.z += windSway * 0.6;`
    );
  };
  material.needsUpdate = true;

  return uniforms;
}
