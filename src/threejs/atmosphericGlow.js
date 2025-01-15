import * as THREE from 'three'

const glowGeometry = new THREE.SphereGeometry(10.2, 32, 32); // Slightly larger than the planet
const glowMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      vec3 glowColor = vec3(0.427, 0.4, 0.384); // Customize the glow color (RGB)
      gl_FragColor = vec4(glowColor, 1.0) * intensity;
    }
  `,
  side: THREE.BackSide,
  transparent: true,
  blending: THREE.AdditiveBlending,
});

export const atmosphericGlow = new THREE.Mesh(glowGeometry, glowMaterial);
