import './style/app.styl'
import * as THREE from 'three'
import Context from "./classes/Context";

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
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFShadowMap;
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

/*
    Light
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)


/**
 * Object
 */

/*const loadingScreen = new LoadingScreen()
loadingScreen.group.position.z = - 20
loadingScreen.group.rotation.y = Math.PI / 4
scene.add(loadingScreen.group)
*/

const context = new Context(camera,scene,renderer)
context.init()