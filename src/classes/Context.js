import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {TweenLite} from "gsap/gsap-core";


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
        this.nbCurrentModelImport = 0
        this.nbModelImport = 0
        this.countHover = 0

        window.addEventListener('mousemove', (_event) => {
            this.cursorX = _event.clientX / this.sizesWidth - 0.5
            this.cursorY = _event.clientY / this.sizesHeight - 0.5
        })
    }

    updateProgressePourcent()
    {
        if(this.nbModelImport == 0){this.nbModelImport = 1}
        this.nbCurrentModelImport++
        const progressePourcent = document.querySelector('.pourcentValue')
        const oldValue = parseInt(progressePourcent.innerText)
        const newValue = (this.nbCurrentModelImport*100)/this.nbModelImport

        let value = oldValue
        let int =  setInterval(()=>
        {
            if(value < newValue)
            {
                value++
                progressePourcent.innerText = value
            }
            if(value == 100)
            {
                this.hiddenoadingScreen()
                clearInterval(int);
            }
        },100)


    }

    hiddenoadingScreen()
    {
        const loadingScreen = document.querySelector('.loadingScreen')
        TweenLite.to(
            loadingScreen,
            2,
            {
                opacity:0,
                display:'none',
                ease: 'Power3.easeInOut'
            }
        )
    }
}