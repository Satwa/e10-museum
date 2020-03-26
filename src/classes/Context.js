import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap/CSSPlugin'
gsap.registerPlugin(CSSPlugin)



export default class Context {

    constructor(camera) {

        this.sizesWidth = window.innerWidth
        this.sizesHeight = window.innerHeight
        this.cursorX = 0
        this.cursorY = 0
        this.raycaster = new THREE.Raycaster()
        this.textureLoader = new THREE.TextureLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('/draco/')
        this.dracoLoader.preload();
        this.gltfLoader = new GLTFLoader()
        this.gltfLoader.setDRACOLoader(this.dracoLoader)
        this.totalLoad = 0
        this.currentLoad = 0
        this.nbCurrentModelImport = 0
        this.nbModelImport = 0
        this.countHover = 0
        this.camera = camera

        window.addEventListener('mousemove', (_event) => {
            this.cursorX = _event.clientX / this.sizesWidth - 0.5
            this.cursorY = _event.clientY / this.sizesHeight - 0.5
        })
    }

    updateProgressePourcent()
    {
        if(this.nbModelImport == 0){this.nbModelImport = 10}
        this.nbCurrentModelImport++
        const progressePourcent = document.querySelector('.pourcentValue')
        const oldValue = parseInt(progressePourcent.innerText)
        const newValue = (this.nbCurrentModelImport*100)/this.nbModelImport
console.log(this.nbModelImport)
        let value = oldValue
        let int =  setInterval(()=>
        {
            if(value < newValue)
            {
                value++
                progressePourcent.innerText = value
            }
            if(value >= 100)
            {
                console.log('finish')
                this.hiddenoadingScreen()
                clearInterval(int);
            }
        },100)


    }

    hiddenoadingScreen()
    {
        const loadingScreen = document.querySelector('.loadingScreen')
        gsap.to(
            loadingScreen,
            2,
            {
                opacity:'0',
                display:'none',
                ease: 'Power3.easeInOut'
            }
        )
    }
}