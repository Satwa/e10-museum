import './style/app.styl'
import * as THREE from 'three'
import LoadingScreen from './classes/LoadingScreen'

const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (_event) => {
    cursor.x = _event.clientX / sizes.width - 0.5
    cursor.y = _event.clientY / sizes.height - 0.5
})


/**
 * Scene
 */
const scene = new THREE.Scene()

const loadingScreen = new LoadingScreen()
loadingScreen.group.position.z = - 20
loadingScreen.group.rotation.y = Math.PI / 4
scene.add(loadingScreen.group)


// scene.add(new THREE.Mesh(
//     new THREE.TorusGeometry(1, .7, 12, 32),
//     new THREE.MeshNormalMaterial()
// ))

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 8
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

/**
 * Resize
 */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Loop
 */
const loop = () => {
    window.requestAnimationFrame(loop)

    camera.position.x = cursor.x * 20
    camera.position.y = -cursor.y * 20

    // camera.lookAt(scene.position)

    // Render
    renderer.render(scene, camera)
}

loop()