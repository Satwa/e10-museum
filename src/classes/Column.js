import * as THREE from "three"

import columnSource from '../textures/concrete2/Concrete_Column_001_basecolor.jpg'
import columnNormalSource from '../textures/concrete2/Concrete_Column_001_normal.jpg'
import columnOccSource from '../textures/concrete2/Concrete_Column_001_ambientOcclusion.jpg'

export default class Column{
    constructor(addTo, position, height = 10){
        this.context = addTo.context

        this.columnTexture = this.context.textureLoader.load(columnSource)
        this.columnTexture.repeat.x = 20
        this.columnTexture.repeat.y = 20
        this.columnTexture.wrapS = THREE.RepeatWrapping
        this.columnTexture.wrapT = THREE.RepeatWrapping
        this.columnNormalTexture = this.context.textureLoader.load(columnNormalSource)
        this.columnNormalTexture.wrapS = THREE.RepeatWrapping
        this.columnNormalTexture.wrapT = THREE.RepeatWrapping
        this.columnOccTexture = this.context.textureLoader.load(columnOccSource)
        this.columnOccTexture.wrapS = THREE.RepeatWrapping
        this.columnOccTexture.wrapT = THREE.RepeatWrapping

        this.group = new THREE.Group()

        this.material = new THREE.MeshStandardMaterial({
            map: this.columnTexture,
            aoMap: this.columnOccTexture,
            normalMap: this.columnNormalTexture,
        })

        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(.4, .4, height, 100),
            this.material
        )
        this.group.add(this.mesh)
        
        this.bigBox = new THREE.Mesh( // Big box is watching you
            new THREE.BoxGeometry(1, 1, 1),
            this.material
        )

        this.smallBox = new THREE.Mesh( // Big box is watching you
            new THREE.BoxGeometry(.85, .85, .85),
            this.material
        )

        this.bigBox.position.y = position.y - height/2
        this.smallBox.position.y = position.y - height/2 + .2
        
        this.bigBoxTop = this.bigBox.clone()
        this.bigBoxTop.position.y = height/2 - 2.5
        
        this.smallBoxTop = this.smallBox.clone()
        this.smallBoxTop.position.y = height/2 - 2.8

        this.group.add(this.bigBox)
        this.group.add(this.smallBox)
        this.group.add(this.bigBoxTop)
        this.group.add(this.smallBoxTop)

        this.group.position.set(position.x, position.y + height/2, position.z)
        addTo.group.add(this.group)
    }
}