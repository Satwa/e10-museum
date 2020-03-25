import * as THREE from 'three'
import {TweenLite} from 'gsap/all'
import {TimelineMax} from 'gsap/all'
import Context from './Context'
import Statue from './Statue'
import floorColorSource from './../textures/floor/WoodFlooringMerbauBrickBondNatural001_COL_3K.jpg'
import floorNormalSource from './../textures/floor/WoodFlooringMerbauBrickBondNatural001_NRM_3K.png'
import wallColorSource from './../textures/floor2/Brick_wall_006_COLOR.jpg'
import wallNormalSource from './../textures/floor2/Brick_wall_006_NRM.jpg'
import Column from "./Column";

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
        this.context.nbModelImport += 3
        this.init()
        window.addEventListener('click',()=>{this.showModel()})
        document.querySelector('.buttonQuitMenu').addEventListener('click', ()=> {this.quitShowingStatue()})

    }

    async init()
    {
        this.createRoom()
        await this.createAllStatue()
        return new Promise((resolve) =>
        {
            if(this.context.currentLoad == this.context.totalLoad)
            {
                console.log("C'est chargé")
                resolve('load')
            }
        })
        this.moveCamera()

    }

    createRoom()
    {
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

        const wallColorTexture = this.context.textureLoader.load(wallColorSource)
        wallColorTexture.wrapS = THREE.RepeatWrapping
        wallColorTexture.wrapT = THREE.RepeatWrapping
        wallColorTexture.repeat.x = 4
        wallColorTexture.repeat.y = 4
        const wallNormalTexture = this.context.textureLoader.load(wallNormalSource)
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
                normalMap: floorNormalTexture
            }
        )
        const wallNSGeometry = new THREE.PlaneGeometry(10,6,20,5)
        const wallEOGeometry = new THREE.PlaneGeometry(10,6,20,5)
        const floorGeometry = new THREE.PlaneGeometry(10,10,5,5)

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


        const wallE =  new THREE.Mesh(wallEOGeometry, wallMaterial)
        wallE.position.y = + 3
        wallE.position.x = - 5
        wallE.rotation.y = 1.5708
        wallE.receiveShadow = true
        wallE.castShadow = false


        const wallO =  new THREE.Mesh(wallEOGeometry,wallMaterial)
        wallO.position.y = + 3
        wallO.position.x =  5
        wallO.rotation.y = -1.5708
        wallO.castShadow = false
        wallO.receiveShadow = true

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

        new Column(this, new THREE.Vector3(2.5, 4, 3.8))
        new Column(this, new THREE.Vector3(-2.5, 4, 3.8))
        new Column(this, new THREE.Vector3(2.5, 4, -3.8))
        new Column(this, new THREE.Vector3(-2.5, 4, -3.8))


        const room = new THREE.Group()

        room.add(lightRoom1)
        room.add(floor)
        room.add(roof)
        room.add(wallN)
        room.add(wallS)
        room.add(wallE)
        room.add(wallO)
        room.scale.set(1.2,1.2,1.2)
        this.group.add(room)
    }

    moveCamera()
    {
        this.camera.position.x = 7
        this.camera.position.y = 1
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
            const  venusMilo = new Statue(this.context)
            const nikeSamo =  new Statue(this.context)
            await hercule.update(this,'/models/hercule/scene.gltf',3,0.12,-10.25,0.5,8.9,-0.39, 1.5708 * 2, 0,-2,2, 1,-1.5708 * 2,0,-1.5708 * 2,0.10,"y","left",document.querySelector('#hercule'))
            await venusMilo.update(this,'/models/venus-de-milo/scene.gltf',3,0.01,4,4,0,0,0,0,-2,2,-1,-1.5708 * 2,-1.5708 * 2,-1.5708 * 2,0.008,"z","right",document.querySelector('#venusDeMilo'))
            await nikeSamo.update(this,'/models/nike_of_samothrace/scene.gltf',5,3.5,0,4,4,0,1.5708 * 2,0,-2,2, 1,-1.5708 * 2,0,-1.5708 * 2,2.5,"y","left",document.querySelector('#NikeSamothrace'))
            resolve('load')
            console.log(hercule)
            console.log(venusMilo)
            console.log(nikeSamo)
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
            this.statueOn.scene.position.y -= 1
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

