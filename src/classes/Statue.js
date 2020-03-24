import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import Context from './Context'
import {TimelineMax, TweenLite} from "gsap/gsap-core";
import * as THREE from "three";


export default class Class {

    constructor(addTo,path,nbChildrend,scale,posY,posX,posZ,rotY,posXView,posYView,posZView,rotXView,rotYView,rotZView,scaleTo,axeToRotate)
    {
        this.context = new Context()
        this.update(addTo,path,nbChildrend,scale,posY,posX,posZ,rotY,posXView,posYView,posZView,rotXView,rotYView,rotZView,scaleTo,axeToRotate)
    }


    async update(addTo,path,nbChildrend,scale,posY,posX,posZ,rotY,posXView,posYView,posZView,rotXView,rotYView,rotZView,scaleTo,axeToRotate)
    {
        const statue =  await this.addStatue(addTo,path)
        this.scene = addTo.statue[addTo.statue.length-1].scene
        this.model = addTo.statue[addTo.statue.length-1].scene
        for(let i = 0; i < nbChildrend;i++)
        {
            this.model = this.model.children[0]
        }
        this.model.scale.set(scale,scale,scale)
        this.model.position.y = posY
        this.model.position.x = posX
        this.model.position.z = posZ
        this.model.rotation.y = rotY
        this.posXView = this.model.position.x + posXView
        this.posYView = posYView
        this.posZView = posZView
        this.rotXView = rotXView
        this.rotYView = rotYView
        this.rotZView = rotZView
        this.scale = scaleTo
        this.hover = false
        this.axeToRotate = axeToRotate
        this.active = false

        addTo.statue[addTo.statue.length-1] = this

        console.log(this)
    }

    addStatue(addTo,path)
    {
        return new Promise((resolve) =>
        {
            this.context.gltfLoader.load(
                path,
                (_gltf) =>
                {
                    const statue = _gltf.scene
                    addTo.statue.push(
                        {
                            scene:statue,
                        })

                    addTo.group.add(statue)

                    resolve('succes')
                }
            )
        })
    }

    animateStatue(camera)
    {


        TweenLite.to(
            this.scene.position,
            1,
            {
                y: +1,
                ease: 'Power3.easeInOut'
            }
        )

        TweenLite.to(
            camera.position,
            2,
            {
                x:this.posXView,
                y:this.posYView,
                z:this.posZView,
                ease: 'Power3.easeInOut'
            }
        )

        TweenLite.to(
            camera.rotation,
            2,
            {
                x: this.rotXView,
                y: this.rotYView ,
                z: this.rotZView,
                ease: 'Power3.easeInOut'
            }
        )


        const t1 = new TimelineMax({})
        t1.from(
            this.scene.position,
            1,
            {
                y: 1.1,
                ease: "power2.inOut"
            })
        t1.to(
            this.scene.position,
            1,
            {
                y: 1,
                ease: "power2.inOut"
            })
        t1.to(
            this.scene.position,
            1,
            {
                y: 1.1,
                ease: "power2.inOut"
            })


        t1.repeat(-1)

    }
}