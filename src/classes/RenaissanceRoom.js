import * as THREE from 'three'
import {TweenLite} from 'gsap/all'
import {TimelineMax} from 'gsap/all'
import Context from './Context'
import Statue from './Statue'
import floorColorSource from './../textures/marble/Marble062_COL_3K.jpg'
import wallColorSource from './../textures/floor2/Brick_wall_006_COLOR.jpg'

export default class RenaissanceRoom {
    constructor(camera, controls) {
        this.group = new THREE.Group()
        this.camera = camera
        this.controls = controls
        this.context = new Context()
        this.statue = []
        this.statueOn = null
        this.groupLightOn = new THREE.Group()
        this.animatedModelFrameId = null
        this.createRoom()
        this.createAllStatue()
        this.moveCamera()

        window.addEventListener('click', () => {
            this.statue.forEach((result) => {
                if(result.hover && !result.active) {
                    result.active = true
                    this.statueOn = result
                    result.animateStatue(this.camera)

                    const statueLight = new THREE.SpotLight(0xffffff, 0.6)
                    statueLight.penumbra = 1

                    this.groupLightOn.add(statueLight)
                    this.group.add(this.groupLightOn)
                    statueLight.target = result.model

                    result.model.scale.set(result.scale, result.scale, result.scale)
                    this.controls.enabled = false
                    this.showModel(result)
                }
            })
        })

        document.querySelector('.buttonQuitMenu').addEventListener('click', () => {
            if(this.statueOn != null) {
                this.statueOn.active = false
                this.statueOn.animation.kill()
                this.controls.enabled = true
                this.statueOn.outContainerInformation()
                this.groupLightOn.remove(this.groupLightOn.children[0])
                console.log(this.statueOn.scale)
                this.statueOn.model.scale.set(this.statueOn.scale, this.statueOn.scale, this.statueOn.scale)
                this.statueOn.scene.position.y -= 1
                this.statueOn.model.rotation.y = this.statueOn.rotYStart
                this.statueOn = null

            }
        })
    }

    createRoom() {
        const floorColorTexture = this.context.textureLoader.load(floorColorSource)
        floorColorTexture.wrapS = THREE.RepeatWrapping
        floorColorTexture.wrapT = THREE.RepeatWrapping
        floorColorTexture.repeat.x = 4
        floorColorTexture.repeat.y = 4

        const wallColorTexture = this.context.textureLoader.load(wallColorSource)
        wallColorTexture.wrapS = THREE.RepeatWrapping
        wallColorTexture.wrapT = THREE.RepeatWrapping
        wallColorTexture.repeat.x = 4
        wallColorTexture.repeat.y = 4


        const wallMaterial = new THREE.MeshStandardMaterial({
            map: wallColorTexture
        })
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorColorTexture
        })
        const wallNSGeometry = new THREE.PlaneGeometry(10, 6, 20, 5)
        const wallEOGeometry = new THREE.PlaneGeometry(10, 6, 20, 5)
        const floorGeometry = new THREE.PlaneGeometry(10, 10, 5, 5)

        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -1.5708

        const roof = new THREE.Mesh(floorGeometry, floorMaterial)
        roof.position.y = 6
        roof.rotation.x = 1.5708

        const wallN = new THREE.Mesh(wallNSGeometry, wallMaterial)
        wallN.position.z = -5
        wallN.position.y = 3

        const wallS = new THREE.Mesh(wallNSGeometry, wallMaterial)
        wallS.position.z = 5
        wallS.position.y = 3
        wallS.rotation.x = -1.5708 * 2

        const wallE = new THREE.Mesh(wallEOGeometry, wallMaterial)
        wallE.position.y = + 3
        wallE.position.x = - 5
        wallE.rotation.y = 1.5708

        const wallO = new THREE.Mesh(wallEOGeometry, wallMaterial)
        wallO.position.y = + 3
        wallO.position.x = 5
        wallO.rotation.y = -1.5708

        const room = new THREE.Group()

        room.add(floor)
        room.add(roof)
        room.add(wallN)
        room.add(wallS)
        room.add(wallE)
        room.add(wallO)
        room.scale.set(1.2, 1.2, 1.2)
        this.group.add(room)
    }

    moveCamera() {
        this.camera.position.x = 7
        this.camera.position.y = 1
        this.camera.position.z = 0
        this.camera.rotation.y = 1.5708

        TweenLite.to(this.camera.position, 2, {
            x: 4,
            ease: 'Power3.easeInOut'
        })
    }



    async createAllStatue() {
        // constructor(addTo,path,nbChildrend,scale,posY,posX,posZ,rotX, rotY, rotZ, posXView,posYView,posZView,rotXView,rotYView,rotZView,scaleTo,axeToRotate)
        const david = new Statue(this, '/models/david/12330_Statue_v1_L2.gltf', 0, .005, 0, 4, 4, -Math.PI / 2, 0, -Math.PI, -2, 2, 1, 1, -1.5708 * 2, 0, -1.5708 * 2, .005, "x")
    }

    hoverStatue() {
        const raycasterCursor = new THREE.Vector2(this.context.cursorX * 2, - this.context.cursorY * 2)
        this.context.raycaster.setFromCamera(raycasterCursor, this.camera)
        this.statue.forEach((result) => {
            if(result.model) {
                const intersects = this.context.raycaster.intersectObject(result.model.children[0])

                if(intersects.length) {
                    result.hover = true
                } else {
                    result.hover = false
                }
            }
        })

    }

    showModel(statue) {
        this.animatedModelFrameId = window.requestAnimationFrame(() => {this.showModel(statue)})
        if(statue.axeToRotate == "y") {
            statue.model.rotation.y += 0.01
        } else {
            statue.model.rotation.z += 0.01
        }
    }
}

