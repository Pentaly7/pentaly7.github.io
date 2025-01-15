<script setup>
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/addons";
import textureAsset from "@/assets/texture.jpg"

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
    map: planetTexture
  })

  // Create a group to hold the planet
  const planetGroup = new THREE.Group();
  scene.add(planetGroup);

  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planetGroup.add(planet);


  const pointLight = new THREE.PointLight(0xffffff, 50)
  pointLight.position.set(-15, 10, 10)
  scene.add(pointLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambientLight)

  const lightHelper = new THREE.PointLightHelper(pointLight, 1)
  scene.add(lightHelper)

  const gridHelper = new THREE.GridHelper(200, 50)
  scene.add(gridHelper)

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)

  const ring = new THREE.Mesh(
      new THREE.RingGeometry(13, 17, 30, 30),
      new THREE.MeshStandardMaterial({color: 0xffffff})
  )

  // make slightly rotate
  ring.rotation.x = -2 / 5 * Math.PI
  ring.rotation.y = Math.PI / 10
  scene.add(ring)

  // planet.rotation.x = -2 / 5 * Math.PI
  // planet.rotation.z = -(Math.PI / 15)

  // allow dragging
  const controls = new OrbitControls(camera, mainCanvasRef.value)
  controls.update()


  // Set initial planet rotation (z-axis)
  planetGroup.rotation.z = -(Math.PI / 15); // Apply z-axis rotation to the group

  function animate() {
    requestAnimationFrame(animate)
    planet.rotation.y -= 0.005; // Adjust the speed as needed
    ring.rotation.z += (Math.PI / 10) * 0.005
    renderer.render(scene, camera)
  }

  animate()
})

</script>

<template>
  <canvas id="main-canvas" ref="mainCanvasRef">

  </canvas>
</template>