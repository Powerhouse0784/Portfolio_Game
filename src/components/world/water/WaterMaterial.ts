import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float elevation =
      sin(pos.x * 1.6 + uTime * 1.1) * 0.035 +
      cos(pos.y * 1.4 + uTime * 0.85) * 0.035;
    pos.z += elevation;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying float vElevation;
  uniform vec3 uColorDeep;
  uniform vec3 uColorShallow;
  uniform float uTime;

  void main() {
    float d = distance(vUv, vec2(0.5));
    vec3 color = mix(uColorShallow, uColorDeep, smoothstep(0.05, 0.5, d));
    color += vElevation * 2.5;
    float sparkle = pow(max(0.0, sin(vUv.x * 40.0 + uTime * 2.0) * cos(vUv.y * 40.0 - uTime * 1.6)), 8.0);
    color += sparkle * 0.25;
    gl_FragColor = vec4(color, 0.88);
  }
`;

export class WaterMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uColorDeep: { value: new THREE.Color("#0d4a55") },
        uColorShallow: { value: new THREE.Color("#3aa9ad") },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }
}
