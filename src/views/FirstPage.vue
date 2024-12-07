<script setup>
import * as THREE from 'three'
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/addons";

/**@type {{value: HTMLCanvasElement}} */
const mainCanvasRef = ref(null)

onMounted(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  const renderer = new THREE.WebGLRenderer({
    canvas: mainCanvasRef.value
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.position.z = 30
  renderer.render(scene, camera)

  const planetGeometry = new THREE.SphereGeometry(10, 32, 32)

  const planetMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  })

  const planet = new THREE.Mesh(planetGeometry, planetMaterial)
  scene.add(planet)

  const pointLight = new THREE.PointLight(0xffffff, 50)
  pointLight.position.set(-15, 10, 10)
  scene.add(pointLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.02)
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

  // allow dragging
  const controls = new OrbitControls(camera, mainCanvasRef.value)
  controls.update()


  function animate() {
    requestAnimationFrame(animate)
    planet.rotation.x += 0.0004
    planet.rotation.y += 0.001
    planet.rotation.z += 0.0007
    renderer.render(scene, camera)
  }

  animate()
})

</script>

<template>
  <canvas id="main-canvas" ref="mainCanvasRef">

  </canvas>
</template>