<script setup>
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/addons";
import textureAsset from "@/assets/texture.jpg"
import {atmosphericGlow} from "@/threejs/atmosphericGlow.js";
import {EffectComposer} from "three/addons";
import {RenderPass} from "three/addons";
import {BloomPass} from "three/addons";
import {ShaderPass} from "three/addons";
import {CopyShader} from "three/addons";

/**@type {{value: HTMLCanvasElement}} */
const mainCanvasRef = ref(null)

onMounted(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)

  const renderer = new THREE.WebGLRenderer({
    canvas: mainCanvasRef.value
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.position.z = 30
  renderer.render(scene, camera)

  const planetGeometry = new THREE.SphereGeometry(10, 32, 32)

  const textureLoader = new THREE.TextureLoader();
  const planetTexture = textureLoader.load(textureAsset); // Update the path to your texture
  // const debugTexture = new THREE.MeshBasicMaterial(
  //     {
  //       color: 0xffffff,
  //       wireframe: true
  //     }
  // )
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
    roughness: 1.2,
    metalness:0.3
  })

  // Create a group to hold the planet
  const planetGroup = new THREE.Group();
  scene.add(planetGroup);

  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planetGroup.add(planet);

  const pointLight = new THREE.PointLight(0xffffff, 150)
  pointLight.position.set(-15, 10, 10)
  scene.add(pointLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.11)
  scene.add(ambientLight)

  // const lightHelper = new THREE.PointLightHelper(pointLight, 1)
  // scene.add(lightHelper)
  //
  // const gridHelper = new THREE.GridHelper(200, 50)
  // scene.add(gridHelper)

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)


  // allow dragging
  const controls = new OrbitControls(camera, mainCanvasRef.value)
  controls.update()

  // Set initial planet rotation (z-axis)
  planetGroup.rotation.z = -(Math.PI / 15); // Apply z-axis rotation to the group

  const atmosphereShader = {
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
      vec3 atmosphereColor = vec3(1.0, 1.0, 1.0); // Customize the atmosphere color (RGB)
      gl_FragColor = vec4(atmosphereColor, 1.0) * intensity;
    }
  `,
    blending: THREE.AdditiveBlending,
  };

  const atmosphereMaterial = new THREE.ShaderMaterial(atmosphereShader);
  const atmosphere = new THREE.Mesh(planetGeometry, atmosphereMaterial);
  atmosphere.scale.set(1.1, 1.1, 1.1); // Slightly larger than the planet
  planet.add(atmosphericGlow)
  planet.add(atmosphere);



  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new BloomPass(0.5, 30, 0.5, 512));
  composer.addPass(new ShaderPass(CopyShader));

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  function animate() {
    requestAnimationFrame(animate)
    planet.rotation.y -= 0.005; // Adjust the speed as needed
    // ring.rotation.z += (Math.PI / 10) * 0.005
    // renderer.render(scene, camera);
    composer.render()
  }

  animate()
})

</script>

<template>
  <canvas id="main-canvas" ref="mainCanvasRef">

  </canvas>
</template>