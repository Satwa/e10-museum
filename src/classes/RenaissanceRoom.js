import * as THREE from 'three'
import {TweenLite} from 'gsap/all'
import Context from './Context'
import Statue from './Statue'
import floorColorSource from './../textures/floor3/wood-flooring-026_d.png'
import floorBumpSource from './../textures/floor3/wood-flooring-026_b.png'
import floorRoughnessSource from './../textures/floor3/wood-flooring-026_r.png'
import wallNormalSource from './../textures/floor2/Brick_wall_006_COLOR.jpg'
import Frame from './Frame'
import Column from './Column'
import Bench from './Bench'

export default class RenaissanceRoom {
    constructor(camera, controls, scene,context) {
        this.group = new THREE.Group()
        this.camera = camera
        this.controls = controls
        //this.renderer = renderer
        this.scene = scene
        this.context = context

        this.statue = []
        this.frames = []
        this.statueOn = null
        this.frameOn = null
        this.groupLightOn = new THREE.Group()
        this.animatedModelFrameId = null

        this.createRoom()
        this.createAllStatue()
        this.moveCamera()

        // DEBUG
        this.group.add(new THREE.AmbientLight(0xffffff, .2))

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
            this.frames.forEach((result) => {
                if(result.hover && !result.active) {
                    console.log("click")
                    result.active = true
                    this.frameOn = result
                    result.animateFrame(this.camera)

                    const statueLight = new THREE.SpotLight(0xffffff, 0.6)
                    statueLight.penumbra = 1

                    this.groupLightOn.add(statueLight)
                    this.group.add(this.groupLightOn)
                    statueLight.target = result.group

                    result.group.scale.set(result.scale.x, result.scale.y, result.scale.z)
                    this.controls.enabled = false
                }
            })
        })

        document.querySelector('.buttonQuitMenu').addEventListener('click', () => {
            if(this.statueOn != null) {
                window.cancelAnimationFrame(this.animatedModelFrameId) // stop rotating
                this.statueOn.active = false
                this.statueOn.animation.kill()
                this.controls.enabled = true
                this.statueOn.outContainerInformation()
                this.groupLightOn.remove(this.groupLightOn.children[0])

                this.statueOn.model.scale.set(this.statueOn.scale, this.statueOn.scale, this.statueOn.scale)
                this.statueOn.scene.position.y -= 1
                this.statueOn.model.rotation.y = this.statueOn.rotYStart
                this.statueOn = null
            } else if(this.frameOn != null) {
                this.frameOn.active = false
                this.controls.enabled = true
                this.frameOn.outContainerInformation()
                this.groupLightOn.remove(this.groupLightOn.children[0])

                this.frameOn.group.scale.set(this.frameOn.scale.x, this.frameOn.scale.y, this.frameOn.scale.z)
                // this.frameOn.group.position.y -= 1
                this.frameOn.group.rotation.y = this.frameOn.rotYStart
                this.frameOn = null
            }
        })
    }

    createRoom() {
        const floorColorTexture = this.context.textureLoader.load(floorColorSource)
        floorColorTexture.wrapS = THREE.RepeatWrapping
        floorColorTexture.wrapT = THREE.RepeatWrapping
        floorColorTexture.repeat.x = 4
        floorColorTexture.repeat.y = 4
        const floorBumpTexture = this.context.textureLoader.load(floorBumpSource)
        floorBumpTexture.wrapS = THREE.RepeatWrapping
        floorBumpTexture.wrapT = THREE.RepeatWrapping
        floorBumpTexture.repeat.x = 4
        floorBumpTexture.repeat.y = 4
        const floorRoughnessTexture = this.context.textureLoader.load(floorRoughnessSource)
        floorRoughnessTexture.wrapS = THREE.RepeatWrapping
        floorRoughnessTexture.wrapT = THREE.RepeatWrapping
        floorRoughnessTexture.repeat.x = 4
        floorRoughnessTexture.repeat.y = 4

        this.wallNormalTexture = this.context.textureLoader.load(wallNormalSource)
        const wallNormalTexture = this.wallNormalTexture
        wallNormalTexture.wrapS = THREE.RepeatWrapping
        wallNormalTexture.wrapT = THREE.RepeatWrapping
        wallNormalTexture.repeat.x = 4
        wallNormalTexture.repeat.y = 4


        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorColorTexture,
            bumpMap: floorBumpTexture,
            roughnessMap: floorRoughnessTexture
        })

        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x5e1612,
            normalMap: wallNormalTexture
        })
        
        // new THREE.PlaneGeometry()
        const wallNSGeometry = new THREE.PlaneGeometry(30, 6, 20, 5)
        const wallEOGeometry = new THREE.PlaneGeometry(10, 6, 20, 5)
        const floorGeometry = new THREE.PlaneGeometry(30, 10, 5, 5)

        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -1.5708

        const roof = new THREE.Mesh(
            new THREE.CylinderGeometry(5, 5, 10, 8, 1, false, 0, Math.PI), 
            new THREE.MeshNormalMaterial({side: THREE.BackSide}) // TODO: Change this texture
        )
        roof.position.y = 6
        roof.rotation.x = Math.PI
        roof.rotation.y = Math.PI 
        roof.rotation.z = -Math.PI / 2
        roof.scale.x = .3
        roof.scale.y = 3

        const wallN = new THREE.Mesh(wallNSGeometry, wallMaterial)
        wallN.position.z = -5
        wallN.position.y = 3

        const wallS = new THREE.Mesh(wallNSGeometry, wallMaterial)
        wallS.position.z = 5
        wallS.position.y = 3
        wallS.rotation.x = -1.5708 * 2

        const wallE = new THREE.Mesh(wallEOGeometry, wallMaterial)
        wallE.position.y = + 3
        wallE.position.x = - 15
        wallE.rotation.y = 1.5708

        const wallO = new THREE.Mesh(wallEOGeometry, wallMaterial)
        wallO.position.y = + 3
        wallO.position.x = 15
        wallO.rotation.y = -1.5708

        const lightRoom1 = new THREE.SpotLight(0xffcc00, 0.8)
        lightRoom1.position.y = 4.9
        lightRoom1.position.x = 0
        lightRoom1.position.z = 0
        lightRoom1.penumbra = 1
        lightRoom1.castShadow = true
        lightRoom1.shadow.mapSize.width = 2512
        lightRoom1.shadow.mapSize.height = 2512
        lightRoom1.shadow.camera.near = 0.2
        lightRoom1.shadow.camera.far = 100

        const col1 = new Column(this, new THREE.Vector3(3, 0, 3), 15)

        const room = new THREE.Group()

        room.add(lightRoom1)
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
        // const david = new Statue(this.context)
        // await david.update(
        //     this, // addTo
        //     '/models/david/david.glb', // path
        //     0, // nbChildren
        //     .1, // scale
        //     0, 4.2, 4, // posY,X,Z
        //     0, Math.PI, 0, // rotation
        //     -2, 2, 1, // posView
        //     -Math.PI / 10, Math.PI, 0, // rotView
        //     .008, // scaleTo
        //     "x", "left",
        //     document.querySelector("#davidMichelangelo")
        // )

        //
        //
        // Side wall

        const midWall = new THREE.Mesh(
            new THREE.BoxGeometry(6, 5, .5),
            new THREE.MeshStandardMaterial({
                color: 0x5e1612,
                normalMap: this.wallNormalTexture
            })
        )
        midWall.position.set(13, 2.5, 0)
        midWall.rotation.y = Math.PI / 2
        this.group.add(midWall)

        const monaLisa = new Frame(
            this,
            "/paintings/mona-lisa.jpg",
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(11.51, 1.2, -.4),
            new THREE.Vector3(0, -Math.PI / 2),
            new THREE.Vector3(9, 2, 2),
            new THREE.Vector3(0, -Math.PI / 2),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )
        monaLisa.direction = "left"

        const nocesCana = new Frame(
            this,
            "/paintings/noces-cana.jpg",
            new THREE.Vector3(1.4, 1.4, 1.4),
            new THREE.Vector3(-16.3, 1.5, 0),
            new THREE.Vector3(0, Math.PI / 2),
            new THREE.Vector3(-12, 1.5, 2),
            new THREE.Vector3(0, Math.PI / 2),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        //
        //
        // Wall in front of camera

        const deposition = new Frame(
            this,
            "/paintings/deposition-du-christ.jpg",
            new THREE.Vector3(1.3, 1.3, 1.3),
            new THREE.Vector3(-12, .8, -4.4),
            new THREE.Vector3(),
            new THREE.Vector3(-14, 2, -2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        const angeGardien = new Frame(
            this,
            "/paintings/lange-gardien.jpg",
            new THREE.Vector3(1.3, 1.3, 1.3),
            new THREE.Vector3(-8, .8, -4.4),
            new THREE.Vector3(),
            new THREE.Vector3(-10, 2, -2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        const couronnementVierge = new Frame(
            this,
            "/paintings/couronnement-vierge.jpg",
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(-3.3, 1, -4.75),
            new THREE.Vector3(),
            new THREE.Vector3(0, 2, -2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )
        couronnementVierge.direction = "left"
        
        const viergeEnfantStAnne = new Frame(
            this,
            "/paintings/Virgin_and_Child_with_St_Anne.jpg",
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(2, 1, -4.75),
            new THREE.Vector3(),
            new THREE.Vector3(0, 2, -2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        const portraitVieillardJeune = new Frame(
            this,
            "/paintings/portrait_vieillard_jeune_garcon.jpg",
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(4, 1, -4.75),
            new THREE.Vector3(),
            new THREE.Vector3(2, 2, -2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        const pelerinsEmmaus = new Frame(
            this,
            "/paintings/les-pelerins-demmaues.jpg",
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(8, 1, -4.75),
            new THREE.Vector3(),
            new THREE.Vector3(6, 2, -2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        const hommeGant = new Frame(
            this,
            "/paintings/lhomme-au-gant.jpg",
            new THREE.Vector3(1.3, 1.3, 1.3),
            new THREE.Vector3(12, .8, -4.4),
            new THREE.Vector3(),
            new THREE.Vector3(10, 2, -2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        //
        //
        // Wall behind camera

        const deuxChiensChasses = new Frame(
            this,
            "/paintings/deux-chiens-chasse-lies-souche.jpg",
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(8, 1, 4.75),
            new THREE.Vector3(0, Math.PI, 0),
            new THREE.Vector3(6, 2, 2),
            new THREE.Vector3(0, -Math.PI, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )
        deuxChiensChasses.direction = "left"

        const apollonDaphne = new Frame(
            this,
            "/paintings/Apollo_and_Daphne.jpg",
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(12, 1, 4.75),
            new THREE.Vector3(0, Math.PI, 0),
            new THREE.Vector3(10, 2, 2),
            new THREE.Vector3(0, -Math.PI, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        const charlesJosephCrowle = new Frame(
            this,
            "/paintings/charles_john_crowle.jpg",
            new THREE.Vector3(1.3, 1.3, 1.3),
            new THREE.Vector3(2, .8, 4.4),
            new THREE.Vector3(0, Math.PI, 0),
            new THREE.Vector3(0, 2, 2),
            new THREE.Vector3(0, -Math.PI, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )
        charlesJosephCrowle.direction = "left"

        const heliodreTemple = new Frame(
            this,
            "/paintings/Heliodore-chasse-du-Temple.jpg",
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(-2, 1, 4.75),
            new THREE.Vector3(0, Math.PI, 0),
            new THREE.Vector3(0, 2, 2),
            new THREE.Vector3(0, -Math.PI, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        const adorationBergers = new Frame(
            this,
            "/paintings/ladoration-des-bergers.jpg",
            new THREE.Vector3(1.3, 1.3, 1.3),
            new THREE.Vector3(-6, .8, 4.4),
            new THREE.Vector3(0, Math.PI, 0),
            new THREE.Vector3(-3.5, 2, 2),
            new THREE.Vector3(0, -Math.PI, 0),
            new THREE.Vector3(3, 3, 3),
            document.querySelector("#davidMichelangelo"),
            this.context
        )

        const bench1 = new Bench(
            this, 
            new THREE.Vector3()
        )
        const bench2 = new Bench(
            this, 
            new THREE.Vector3(-10)
        )
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
        this.frames.forEach((result) => {
            if(result.group) {
                const intersects = this.context.raycaster.intersectObject(result.group.children[1])

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
