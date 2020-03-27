import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js'
import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap/CSSPlugin'
import GreeceRoom from "./GreeceRoom";
import RenaissanceRoom from "./RenaissanceRoom";
import {FirstPersonControls} from "./FirstPersonControls";
import HoleDigger from './Hole'
import Column from './Column'
gsap.registerPlugin(CSSPlugin)



export default class Context {

    constructor(camera,scene,renderer) {

        this.sizesWidth = window.innerWidth
        this.sizesHeight = window.innerHeight
        this.cursorX = 0
        this.cursorY = 0
        this.raycaster = new THREE.Raycaster()
        this.textureLoader = new THREE.TextureLoader()
        this.textureDSSLoader = new DDSLoader()
        this.gltfLoader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('/draco/')
        this.dracoLoader.setDecoderConfig({type: 'js'});
        this.dracoLoader.preload();
        this.gltfLoader.setDRACOLoader(this.dracoLoader)
        this.totalLoad = 0
        this.currentLoad = 0
        this.nbCurrentModelImport = 0
        this.nbModelImport = 0
        this.countHover = 0
        this.isLoaded = false
        this.renderer = renderer
        this.camera = camera
        this.scene = scene
        this.controls =  new FirstPersonControls(camera,this.renderer.domElement)
        this.controls.movementSpeed = 10;
        this.controls.lookSpeed = 0.1;
        this.controls.lookVertical = false
        window.addEventListener('mousemove', (_event) => {
            this.cursorX = _event.clientX / this.sizesWidth - 0.5
            this.cursorY = _event.clientY / this.sizesHeight - 0.5
        })

       // this.controls = new OrbitControls(camera,renderer.domElement)

        window.addEventListener('keypress',(_event)=>{
            if(_event.key == "l")
            {
                console.log("posX : "+ camera.position.x)
                console.log("posY : "+camera.position.y)
                console.log("posZ : "+camera.position.z)
                console.log("rotX : "+camera.rotation.x)
                console.log("rotY : "+camera.rotation.y)
                console.log("rotZ : "+camera.rotation.z)
            }
        })
    }

    updateProgressePourcent()
    {
        let divise = this.nbModelImport
        if( divise == 0){divise = 10}
        //this.nbCurrentModelImport++
        const progressePourcent = document.querySelector('.pourcentValue')
        //const oldValue = parseInt(progressePourcent.innerText)
        //const newValue = (this.nbCurrentModelImport*100)/ divise
      //  let value = oldValue
        let value = 0
        let int =  setInterval(()=>
        {
         //   if(value < newValue)
        //    {
                value++
                progressePourcent.innerText = value
         //   }
            if(value >= 100)
            {

                this.hiddenoadingScreen()
                clearInterval(int);
            }
        },100)


    }

    async init()
    {
        this.greeceRoom = new GreeceRoom(this.camera,this.controls,this.scene,this)
        this.renaissanceRoom = new RenaissanceRoom(this.camera, this.controls,this.scene,this)

        /**
         * Loop
         */
        const clock = new THREE.Clock();
        const loop = () => {
            window.requestAnimationFrame(loop)
            
            this.greeceRoom.isLoaded ? this.greeceRoom.hoverStatue() : null
            this.renaissanceRoom.isLoaded ? this.renaissanceRoom.hoverStatue() : null

            // Render
            this.controls.update( clock.getDelta() );
            this.renderer.render(this.scene, this.camera)
        }
        loop()
        window.addEventListener("mouseover", (_event) => {
           if(this.greeceRoom.statueOn == null && this.renaissanceRoom.statueOn == null ){ this.controls.enabled = true}
        })

        window.addEventListener("mouseout", (_event) => {
            this.controls.enabled = false
        })
        await this.greeceRoom.createRoom()
        await this.renaissanceRoom.createRoom()
        this.greeceRoom.group.position.x = 0
        this.scene.add(this.greeceRoom.group)
        this.scene.add(this.renaissanceRoom.group)


        this.greeceRoom.moveCamera()
        this.updateProgressePourcent()

        await this.greeceRoom.init()
        this.renaissanceRoom.init()


        this.scene.add(this.greeceRoom.group)






        // this.renaissanceRoom.group.visible = false
        this.scene.add(this.renaissanceRoom.group)




        // debug room switch
        window.addEventListener("keydown", (_event) => {
            if(_event.key == "p" || _event.key == "P"){
                this.greeceRoom.group.visible = !this.greeceRoom.group.visible
                this.renaissanceRoom.group.visible = !this.renaissanceRoom.group.visible
            }
        })


    }

    hiddenoadingScreen()
    {
        const loadingScreen = document.querySelector('.loadingScreen')
        const pourcentContent = document.querySelector('.pourcentContent')
        const start = document.querySelector('.start')

        gsap.to(
            pourcentContent,
            1,
            {
                opacity:'0',
                display: 'none',
                ease: 'Power3.easeInOut'
            }
        )

        gsap.to(
           start,
            2,
            {
                display: "block",
                opacity:'1',
                ease: 'Power3.easeInOut'
            }
        ).delay(1.2)


        gsap.to(
            loadingScreen,
            3,
            {
                opacity:'0',
                display:'none',
                ease: 'Power3.easeInOut'
            }
        ).delay(2.8)
    }
}