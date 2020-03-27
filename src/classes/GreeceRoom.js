import * as THREE from 'three'
import {TweenLite} from 'gsap/all'
import {TimelineMax} from 'gsap/all'
import Context from './Context'
import Statue from './Statue'
import wallColorSource from './../textures/floor2/a52wd-s4phv.dds'
import wallNormalSource from './../textures/floor2/a8wye-2vua2.dds'
import graniteColorSource from './../textures/Granite_001_SD/avr7v-uriz1.dds'
import graniteNormalSource from './../textures/Granite_001_SD/aeogd-ergzr.dds'
import floorColorSource from './../textures/floor/WoodFlooringMerbauBrickBondNatural001_COL_3K.jpg'
import floorNormalSource from './../textures/floor/WoodFlooringMerbauBrickBondNatural001_COL_3K.jpg'
import Column from "./Column";
import HoleDigger from './Hole'

export default class GreeceRoom {

    constructor(camera,controls,scene,context) {
        this.group = new THREE.Group()
        this.camera = camera
        this.controls = controls
        this.scene = scene
        this.context =  context
        this.statue = []
        this.statueOn = null;
        this.groupLightOn = new THREE.Group()
        this.context.nbModelImport += 6
    }

    async init()
    {
         await this.createRoom()
        this.context.scene.add(this.group)
        this.moveCamera()
        this.context.updateProgressePourcent()


        await this.createAllStatue()
        return new Promise((resolve) =>
        {
            console.log(this.context.nbCurrentModelImport , this.context.nbModelImport)
            if(this.context.nbCurrentModelImport == this.context.nbModelImport)
            {
                window.addEventListener('click',()=>{this.showModel()})
                document.querySelector('.buttonQuitMenu').addEventListener('click', ()=> {this.quitShowingStatue()})
                resolve('load')
            }
        })


    }

    async createRoom()
    {
        return new Promise((resolve) => {

            const floorColorTexture = this.context.textureLoader.load(floorColorSource)
            floorColorTexture.wrapS = THREE.RepeatWrapping
            floorColorTexture.wrapT = THREE.RepeatWrapping
            floorColorTexture.repeat.x = 4
            floorColorTexture.repeat.y = 4

            const floorNormalTexture = this.context.textureLoader.load(floorNormalSource)
            floorNormalTexture.wrapS = THREE.RepeatWrapping
            floorNormalTexture.wrapT = THREE.RepeatWrapping
            floorNormalTexture.repeat.x = 4
            floorNormalTexture.repeat.y = 4

            const wallColorTexture = this.context.textureDSSLoader.load(wallColorSource)
            wallColorTexture.wrapS = THREE.RepeatWrapping
            wallColorTexture.wrapT = THREE.RepeatWrapping
            wallColorTexture.repeat.x = 4
            wallColorTexture.repeat.y = 4

            const wallNormalTexture = this.context.textureDSSLoader.load(wallNormalSource)
            wallNormalTexture.wrapS = THREE.RepeatWrapping
            wallNormalTexture.wrapT = THREE.RepeatWrapping
            wallNormalTexture.repeat.x = 4
            wallNormalTexture.repeat.y = 4

            const graniteColorTexture = this.context.textureDSSLoader.load(graniteColorSource)
            wallNormalTexture.wrapS = THREE.RepeatWrapping
            wallNormalTexture.wrapT = THREE.RepeatWrapping
            wallNormalTexture.repeat.x = 4
            wallNormalTexture.repeat.y = 4

            const graniteNormalTexture = this.context.textureDSSLoader.load(graniteNormalSource)
            wallNormalTexture.wrapS = THREE.RepeatWrapping
            wallNormalTexture.wrapT = THREE.RepeatWrapping
            wallNormalTexture.repeat.x = 4
            wallNormalTexture.repeat.y = 4



            const wallMaterial = new THREE.MeshStandardMaterial(
                {
                    map: wallColorTexture,
                    normalMap:wallNormalTexture
                }
            )

            const floorMaterial = new THREE.MeshStandardMaterial(
                {
                    map: floorColorTexture,
                    normalMap: floorNormalTexture,
                }
            )
            const graniteMaterial = new THREE.MeshStandardMaterial(
                {
                    map: graniteColorTexture,
                    normalMap: graniteNormalTexture
                }
            )


            const wallNSGeometry = new THREE.PlaneGeometry(10,6,20,5)
            const wallEOGeometry = new THREE.BoxGeometry(10, 6, .1, 20, 5)
            const floorGeometry = new THREE.PlaneGeometry(10,10,5,5)
            const consoleGeometry = new THREE.BoxGeometry(2,1,1.6)
            const console2Geometry = new THREE.BoxGeometry(1,1.3,1.4)

            const floor = new THREE.Mesh(floorGeometry,floorMaterial)
            floor.rotation.x = -1.5708
            floor.receiveShadow = true
            floor.castShadow = false


            const roof = new THREE.Mesh(floorGeometry,floorMaterial)
            roof.position.y = 6
            roof.rotation.x = 1.5708

            const wallN = new THREE.Mesh(wallNSGeometry, wallMaterial)
            wallN.position.z  = -5
            wallN.position.y = 3
            wallN.receiveShadow = true
            wallN.castShadow = false


            const wallS = new THREE.Mesh(wallNSGeometry, wallMaterial)
            wallS.position.z  = 5
            wallS.position.y =  3
            wallS.rotation.x = -1.5708 * 2
            wallS.receiveShadow = true
            wallS.castShadow = false

            const wallE = new THREE.Mesh(wallEOGeometry, wallMaterial)
            wallE.position.y = + 3
            wallE.position.x = - 5
            wallE.rotation.y = Math.PI / 2
            wallE.receiveShadow = true
            wallE.castShadow = false


            const wallO = new HoleDigger(wallEOGeometry.clone(), new THREE.BoxGeometry(3.35, 4, .1), wallMaterial, new THREE.Vector3(0, -1), new THREE.Vector3(0, -Math.PI))
            wallO.getMesh().position.y = + 3
            wallO.getMesh().position.x =  5
            wallO.getMesh().rotation.y = -Math.PI/2
            wallO.getMesh().castShadow = false
            wallO.getMesh().receiveShadow = true

            const consoleStatue = new THREE.Mesh(consoleGeometry,graniteMaterial)
            consoleStatue.position.z = -3.37

            const console2Statue = new THREE.Mesh(console2Geometry,graniteMaterial)
            console2Statue.position.x = -3.7
            console2Statue.position.z = 3.45
            console2Statue.position.y = 0

            const lightRoom1 = new THREE.SpotLight(0xffcc00,0.8)
            lightRoom1.position.y = 4.9
            lightRoom1.position.x = 0
            lightRoom1.position.z = 0
            lightRoom1.penumbra = 1
            lightRoom1.castShadow = true;
            lightRoom1.shadow.mapSize.width = 2512;
            lightRoom1.shadow.mapSize.height = 2512;
            lightRoom1.shadow.camera.near = 0.2;
            lightRoom1.shadow.camera.far = 100

            new Column(this, new THREE.Vector3(2.5, 0, 3.8))
            new Column(this, new THREE.Vector3(-2.5, 0, 3.8))
            new Column(this, new THREE.Vector3(2.5, 0, -3.8))
            new Column(this, new THREE.Vector3(-2.5, 0, -3.8))


            const room = new THREE.Group()

            room.add(lightRoom1)
            room.add(floor)
            room.add(roof)
            room.add(consoleStatue)
            room.add(console2Statue)
            room.add(wallN)
            room.add(wallS)
            room.add(wallE)
            room.add(wallO.getMesh())
            room.scale.set(1.2,1.2,1.2)
            this.group.add(room)
            resolve('finish')
        })
    }

    moveCamera()
    {
        this.camera.position.x = 7
        this.camera.position.y = 2
        this.camera.position.z = 0
        this.camera.rotation.y = 1.5708

        TweenLite.to(
            this.camera.position,
            2,
            {
                x: 4,
                ease: 'Power3.easeInOut'
            }
        )
    }



    async createAllStatue()
    {
        return new Promise(async (resolve) =>
        {
            const hercule =  new Statue(this.context)
            const spartacus =  new Statue(this.context)
            const venusMilo = new Statue(this.context)
            const nikeSamo =  new Statue(this.context)
            const laLoire =  new Statue(this.context)
            const marcusAurelius =  new Statue(this.context)
            await hercule.update(this,'/models/hercule/scene.gltf',3,0.12,-10.25,0.5,8.9,-0.39, 1.5708 * 2, 0,-2,2, 1,-1.5708 * 2,0,-1.5708 * 2,0.10,"y","left",document.querySelector('#hercule'),1)
            await spartacus.update(this,'/models/spartacus/scene.gltf',1,0.085,0,-4.2,-3.7,-1.5708,0,-1.0708, 1.9721,2.4760, -1.5317,0,0.41728,0,0.07,"z","left",document.querySelector('#spartacus'),1.3 )
            await venusMilo.update(this,'/models/venus-de-milo/scene.gltf',3,0.01,4,4,0,0,0,0,-2,2,-1,-1.5708 * 2,-1.5708 * 2,-1.5708 * 2,0.008,"z","right",document.querySelector('#venusDeMilo'),1)
            await nikeSamo.update(this,'/models/nike_of_samothrace/scene.gltf',5,3.5,0,4,4,0,1.5708 * 2,0,-2,2, 1,-1.5708 * 2,0,-1.5708 * 2,2.5,"y","left",document.querySelector('#NikeSamothrace'),1)
            await laLoire.update(this,'/models/la_loire_et_le_loiret/scene.gltf',4,0.13,13.4,4.85,0.7,0,0,-1.5708, -4.047,2.18015, -1.9339, -0.5791,0.2609,0.1671, 0.1,"z","left",document.querySelector('#loireEtLoiret'),0.3)
            await marcusAurelius.update(this,'/models/marcus_aurelius/scene.gltf',1,0.18,1.5,-4.4,4,-1.5708,0,1.5708 *2, 0.8386,2.3763, 1.8723, -2.6339,0.6549,2.8077, 0.1,"z","left",document.querySelector('#marcusAurelius'),0.3)
            resolve('load')
        })
    }

    hoverStatue()
    {

        const raycasterCursor = new THREE.Vector2(this.context.cursorX * 2, - this.context.cursorY * 2 )
        this.context.raycaster.setFromCamera(raycasterCursor,this.camera)
        this.statue.forEach((result) =>
        {
            if(result.model)
            {
                const intersects = this.context.raycaster.intersectObject(result.scene,true)
                if(intersects.length)
                    {
                        this.context.countHover = 0
                        result.hover = true
                        document.body.classList.add('on')
                    }
                    else
                    {
                        this.context.countHover++
                        result.hover = false
                        if(this.context.countHover > 3)
                        {
                            document.body.classList.remove('on')
                        }
                    }

            }
        })

    }

    showModel()
    {
        this.statue.forEach((result)=>
        {
            if(result.hover && !result.active && this.statueOn == null)
            {
                result.animateStatue(this.camera)

                result.active = true
                this.statueOn = result


                const statueLight = new THREE.SpotLight(0xffffff, 0.5)
                statueLight.penumbra = 1
                statueLight.castShadow = true;

                this.groupLightOn.add(statueLight)
                this.group.add(this.groupLightOn)
                statueLight.target = result.model
                statueLight.shadow.mapSize.width = 4300;
                statueLight.shadow.mapSize.height = 4300;
                statueLight.shadow.camera.near = 0.1;
                statueLight.shadow.camera.far = 10
                result.model.scale.set(result.scaleTo,result.scaleTo,result.scaleTo)
                this.controls.enabled = false
                this.turnStatue(result)

            }
        })



    }

    turnStatue(statue)
    {
        window.requestAnimationFrame(() => {this.turnStatue(statue)})
        if(this.statueOn == statue)
        {
            if(statue.axeToRotate == "y")
            {
                statue.model.rotation.y += 0.007

            }
            else
            {
                statue.model.rotation.z += 0.007
            }
        }
    }

    quitShowingStatue()
    {
        if(this.statueOn != null)
        {
            this.statueOn.active = false
            this.controls.enabled = true
            this.statueOn.outContainerInformation()
            this.groupLightOn.remove(this.groupLightOn.children[0])
            this.statueOn.model.scale.set(this.statueOn.scale,this.statueOn.scale,this.statueOn.scale)
            this.statueOn.scene.position.y -= this.statueOn.upY
            this.statueOn.animation.kill()
            if(this.statueOn.axeToRotate == 'y')
            {
                this.statueOn.model.rotation.y = this.statueOn.rotYStart
            }
            else
            {
                this.statueOn.model.rotation.z = this.statueOn.rotYStart

            }
            this.statueOn = null
        }
    }

}

