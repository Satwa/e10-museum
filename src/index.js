import './style/app.styl'
import * as THREE from 'three'
import LoadingScreen from './classes/LoadingScreen'
import GreeceRoom from './classes/GreeceRoom'
import RenaissanceRoom from './classes/RenaissanceRoom'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
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
 * Controls
 * @type {FirstPersonControls}
 */

const controls = new FirstPersonControls(camera,renderer.domElement)
controls.movementSpeed = 10;
controls.lookSpeed = 0.1;
controls.lookVertical = false



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

const context = new Context()

// Greece Room
const greeceRoom = new GreeceRoom(camera,controls,scene,context)
greeceRoom.group.position.x = 0
scene.add(greeceRoom.group)

// Renaissance Room
const renaissanceRoom = new RenaissanceRoom(camera, controls, scene)
renaissanceRoom.group.position.x = 0
renaissanceRoom.group.visible = false
scene.add(renaissanceRoom.group)


// debug room switch
window.addEventListener("keydown", (_event) => {
    if(_event.key == "p" || _event.key == "P"){
        greeceRoom.group.visible = !greeceRoom.group.visible
        renaissanceRoom.group.visible = !renaissanceRoom.group.visible
    }
})

/**
 * Loop
 */
const clock = new THREE.Clock();
const loop = () => {
    window.requestAnimationFrame(loop)

    greeceRoom.group.visible ? greeceRoom.hoverStatue() : null
    renaissanceRoom.group.visible ? renaissanceRoom.hoverStatue() : null
    
    // camera.lookAt(scene.position)
    // Render
    controls.update( clock.getDelta() );
    renderer.render(scene, camera)
}
loop()