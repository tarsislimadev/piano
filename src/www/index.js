import * as THREE from 'three'
import COLORS from './colors.js'

const width = window.innerWidth
const height = window.innerHeight

const ASPECT = width / height

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, ASPECT)
camera.position.set(+10.0, +10.0, +0.0)
camera.lookAt(+0.0, +0.0, +0.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

document.body.style.margin = '0'

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: COLORS.YELLOW }),
)
scene.add(cube)

function animate() {
  cube.rotation.x += 0.01
  //
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

