import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default class Context {

    constructor() {

        this.sizesWidth = window.innerWidth
        this.sizesHeight = window.innerHeight
        this.cursorX = 0
        this.cursorY = 0
        this.raycaster = new THREE.Raycaster()
        this.textureLoader = new THREE.TextureLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('/draco/')
        this.gltfLoader = new GLTFLoader()
        this.gltfLoader.setDRACOLoader(this.dracoLoader)
        this.totalLoad = 0
        this.currentLoad = 0

        window.addEventListener('mousemove', (_event) => {
            this.cursorX = _event.clientX / this.sizesWidth - 0.5
            this.cursorY = _event.clientY / this.sizesHeight - 0.5
        })
    }

}