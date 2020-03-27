import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import Context from './Context'
import {TimelineMax, TweenLite} from "gsap/gsap-core";
import * as THREE from "three";


export default class Class {

    constructor(context)
    {
        this.context =  context
    }


    async update(addTo,path,nbChildrend,scale,posY,posX,posZ,rotX,rotY,rotZ,posXView,posYView,posZView,rotXView,rotYView,rotZView,scaleTo,axeToRotate,direction,$contentInfo,upY)
    {
        this.upY = upY
        this.scene = addTo.scene
        this.direction = direction
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
        this.model.rotation.x = rotX
        this.model.rotation.y = rotY
        this.model.rotation.z = rotZ
        if(axeToRotate == 'y')
        {
            this.rotYStart = rotY
        }
        else
        {
            this.rotYStart = rotZ
        }
        this.posXView = this.model.position.x + posXView
        this.posYView = posYView
        this.posZView = posZView
        this.rotXView = rotXView
        this.rotYView = rotYView
        this.rotZView = rotZView
        this.scale = scale
        this.scaleTo = scaleTo
        this.hover = false
        this.active = false
        this.axeToRotate = axeToRotate
        this.$contentInfo = $contentInfo
        this.model.children.forEach((mesh) =>
        {
            mesh.castShadow = true
            mesh.frustumCulled = false;

            mesh.onAfterRender = function(){

                mesh.frustumCulled = true;

                mesh.onAfterRender = function(){};

            };
        })
        addTo.statue[addTo.statue.length-1] = this
    }

    addStatue(addTo,path)
    {
        return new Promise((resolve) =>
        {
            let getTotalLoad = false
            let loaded = 0

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
                   // this.context.updateProgressePourcent()
                    this.context.nbCurrentModelImport++
                    resolve('succes')
                },
                (_gltf) =>
                {
                    if(!getTotalLoad)
                    {
                        this.context.totalLoad = this.context.totalLoad +  _gltf.total
                        getTotalLoad = true
                    }
                    this.context.currentLoad +=  _gltf.loaded - loaded
                    loaded =  _gltf.loaded
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
                y: this.upY,
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


        this.animation = new TimelineMax({})
        this.animation.from(
            this.scene.position,
            1,
            {
                y: this.upY +  0.1,
                ease: "power2.inOut"
            }).to(
            this.scene.position,
            1,
            {
                y: this.upY,
                ease: "power2.inOut"
            }).to(
            this.scene.position,
            1,
            {
                y: this.upY + 0.1,
                ease: "power2.inOut"
            })


        this.animation.repeat(-1)
        this.getContainerInformation()

    }

    getContainerInformation()
    {

        let start,end
        const containerInformation = document.querySelector('#containerInformation')

        if(this.direction == "left")
        {
            start = "translateX(100vw)"
            end = "translateX(50vw)"
            containerInformation.classList.add('right')
        }
        else
        {
            start = "translateX(-50vw)"
            end = "translateX(0vw)"
            containerInformation.classList.add('left')
        }

        TweenLite.from(
            containerInformation,
            2,
            {
                display: "flex",
                opacity:0,
                transform:start,
                ease: 'Power3.easeInOut'
            }
        ).delay(1)

        TweenLite.to(
            containerInformation,
            2,
            {
                display: "flex",
                opacity : 1,
                transform: end,
                ease: 'Power3.easeInOut'
            }
        ).delay(1)
        this.$contentInfo.classList.add('show')
    }

    outContainerInformation()
    {

        let start,end

        if(this.direction == "left")
        {
            start = "translateX(50vw)"
            end = "translateX(100vw)"
        }
        else
        {
            start = "translateX(0vw)"
            end = "translateX(-50vw)"

        }

        TweenLite.from(
            "#containerInformation",
            2,
            {
                display: "flex",
                opacity:1,
                transform:start,
                ease: 'Power3.easeInOut'
            }
        )

        TweenLite.to(
            "#containerInformation",
            2,
            {
                display: "none",
                opacity : 0,
                transform: end,
                ease: 'Power3.easeInOut'
            }
        )
        this.$contentInfo.classList.remove('show')
        if(this.direction == "left")
        {
           document.querySelector('.containerInformation').classList.remove('right')
        }
        else
        {
            document.querySelector('.containerInformation').classList.remove('left')
        }
    }
}