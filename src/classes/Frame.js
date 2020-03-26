import Context from './Context'
import {TimelineMax, TweenLite} from "gsap/gsap-core"
import * as THREE from "three"
import {MeshStandardMaterial} from 'three'

export default class Frame {
    /**
     * addToRoom: Room
     * path: URL to painting
     * scale: Vector3
     * position: Vector3
     * rotation: Vector3
     * position/rotationView: Vector3 | how to place camera on click
     * scaleTo: n resize when focusing
     */
    constructor(addToRoom, path, scale, position, rotation, positionView, rotationView, scaleTo, $contentInfo,context) {
        this.context = context
        this.scene = addToRoom.scene

        // positionView.x += this.model.position.x
        this.group = new THREE.Group()
        this.positionView = positionView
        this.rotationView = rotationView
        this.scale = scale
        this.scaleTo = scaleTo
        this.hover = false
        this.active = false
        this.$contentInfo = $contentInfo

        this.context.gltfLoader.load('/models/frame/frame.glb', (_glb) => {
            this.frameMesh = _glb.scene.children[0].children[0]

            // get size of frame
            const boundingBox = new THREE.Box3().setFromObject(this.frameMesh)
            this.frameSize = boundingBox.getSize()

            this.update(addToRoom, path, scale, position, rotation, positionView, rotationView, scaleTo)
        })

        // console.log()
        // addToRoom.frames[addToRoom.frames.length - 1] = this
    }


    async update(addToRoom, path, scale, position, rotation, positionView, rotationView, scaleTo) {
        this.addPainting(addToRoom, path)
        
        this.group.scale.set(scale.x, scale.y, scale.z)
        this.group.position.set(position.x, position.y, position.z)
        this.group.rotation.set(rotation.x, rotation.y, rotation.z)
        this.rotYStart = rotationView.y
        addToRoom.frames.push(this)
    }

    addPainting(addToRoom, path) {
        this.context.textureLoader.load(path, (_texture) => {
            const ratio = _texture.image.width / _texture.image.height

            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(2 * ratio, 2),
                new MeshStandardMaterial({
                    map: _texture
                })
            )

            // this won't work in any other case than Mona Lisa at this ratio
            plane.position.z = -1.2
            plane.position.y = 1
            plane.position.x = .2

            const frame = this.frameMesh

            // get size of painting
            const boundingBox = new THREE.Box3().setFromObject(plane)
            const paintingSize = boundingBox.getSize()

            if(ratio > 1){
                frame.scale.set(
                    (this.frameSize.x + paintingSize.x) / this.frameSize.x,
                    (this.frameSize.y + paintingSize.y) / this.frameSize.y,
                    1
                )
                frame.rotateZ(Math.PI / 2)
            }else{
                frame.scale.set(
                    (this.frameSize.x - paintingSize.x) / this.frameSize.x, 
                    (this.frameSize.y - paintingSize.y) / this.frameSize.y, 
                    1
                )
            }

            this.group.add(frame)
            this.group.add(plane)

            addToRoom.group.add(this.group)
            this.scene.traverse(obj => obj.frustumCulled = false);
        })
    }

    animateFrame(camera) {
        TweenLite.to(this.group.position, 1, {
            y: +1,
            ease: 'Power3.easeInOut'
        })

        TweenLite.to(camera.position, 2, {
            x: this.positionView.x,
            y: this.positionView.y,
            z: this.positionView.z,
            ease: 'Power3.easeInOut'
        })

        TweenLite.to(camera.rotation, 2, {
            x: this.rotationView.x,
            y: this.rotationView.y,
            z: this.rotationView.z,
            ease: 'Power3.easeInOut'
        })

        this.getContainerInformation()
    }

    getContainerInformation() {
        let start, end
        const containerInformation = document.querySelector('#containerInformation')

        if(this.direction == "left") {
            start = "translateX(100vw)"
            end = "translateX(50vw)"
            containerInformation.classList.add('right')
        }else{
            start = "translateX(-50vw)"
            end = "translateX(0vw)"
            containerInformation.classList.add('left')
        }

        TweenLite
            .from(containerInformation, 2, {
                display: "flex",
                opacity: 0,
                transform: start,
                ease: 'Power3.easeInOut'
            })
            .delay(1)

        TweenLite
            .to(containerInformation, 2,{
                display: "flex",
                opacity: 1,
                transform: end,
                ease: 'Power3.easeInOut'
            })
            .delay(1)
        this.$contentInfo.classList.add('show')
    }

    outContainerInformation() {
        let start, end
        const containerInformation = document.querySelector('#containerInformation')

        if(this.direction == "left") {
            start = "translateX(50vw)"
            end = "translateX(100vw)"
        }
        else {
            start = "translateX(0vw)"
            end = "translateX(-50vw)"
        }

        TweenLite.from(containerInformation, 2, {
            display: "flex",
            opacity: 1,
            transform: start,
            ease: 'Power3.easeInOut'
        })

        TweenLite.to(containerInformation, 2, {
            display: "none",
            opacity: 0,
            transform: end,
            ease: 'Power3.easeInOut'
        })

        this.$contentInfo.classList.remove('show')
    }
}