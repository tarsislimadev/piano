import * as THREE from 'three'

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

// import { Panel } from './panel.js'
import COLORS from './colors.js'
import FONTS from './fonts.js'

const _ = {
  getWidth: () => window.innerWidth,
  getHeight: () => window.innerHeight,
  getAspect: () => _.getWidth() / _.getHeight(),
  side: THREE.DoubleSide,
}

// const panel = new Panel({ name: 'Piano' })

const loader = new FontLoader()

const scene = new THREE.Scene()

const KEYS = {
  C4: 'C4',
  D4: 'D4',
  E4: 'E4',
  F4: 'F4',
  G4: 'G4',
  A4: 'A4',
  B4: 'B4',
  C5: 'C5',
}

const createTextGeometry = (text = 'Hello three.js!', {
  size = 1,
} = {}) => new Promise((res, rej) => {
  loader.load(
    FONTS.HELVETIKER,
    (font) => res(new TextGeometry(text, { font, size, height: size / 2 })),
    () => console.log(),
    (err) => rej(err),
  )
})

const lights = [
  { color: COLORS.WHITE, type: 'AmbientLight' },
  { color: COLORS.WHITE, type: 'DirectionalLight' },
].map(({ color, type, }) => new THREE[type](color))

lights.map((light) => scene.add(light))

const keysTextMaterial = new THREE.MeshBasicMaterial({
  color: COLORS.BLACK,
  side: _.side,
})

const keys = Object.keys(KEYS).map((keyText, ix) => {
  const key = new THREE.Mesh(
    new THREE.BoxGeometry(+5.0, +0.1, +1.0),
    new THREE.MeshBasicMaterial({ color: COLORS.WHITE })
  )

  key.userData['key'] = keyText
  key.position.z = (Object.keys(KEYS).length / +1.8) - (+1.2 * ix)

  createTextGeometry(keyText, { size: +0.5 }).then((keysTextGeo) => {
    const textMesh = new THREE.Mesh(keysTextGeo, keysTextMaterial)

    textMesh.rotation.set((-Math.PI / 2), (+0.0), (+Math.PI / 2))
    textMesh.position.set(+2.0, -0.15, +0.4)

    key.add(textMesh)
  })

  return key
})

keys.map((key) => scene.add(key))

const camera = new THREE.PerspectiveCamera(75, _.getAspect())
camera.position.set(+5.0, +5.0, +0.0)
camera.lookAt(+0.0, +0.0, +0.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(_.getWidth(), _.getHeight())
document.body.appendChild(renderer.domElement)

document.body.style.margin = '0'

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

const playKey = (keyText) => {
  console.log({ keyText })

  const key = keys.find((k) => k.userData['key'] == keyText)

  if (!key) return

  key.material.color.set(COLORS.YELLOW)

  setTimeout(() => {
    key.material.color.set(COLORS.WHITE)
  }, 100)
}

window.addEventListener('keypress', (ev) => {
  switch (ev.key) {
    case 'a': return playKey(KEYS.C4)
    case 's': return playKey(KEYS.D4)
    case 'd': return playKey(KEYS.E4)
    case 'f': return playKey(KEYS.F4)
    case 'g': return playKey(KEYS.G4)
    case 'h': return playKey(KEYS.A4)
    case 'j': return playKey(KEYS.B4)
    case 'k': return playKey(KEYS.C5)
  }
})

window.onresize = function () {
  camera.aspect = _.getAspect()
  camera.updateProjectionMatrix()
  //
  renderer.setSize(_.getWidth(), _.getHeight())
}
