import * as THREE from "three"

import columnSource from '../textures/concrete2/Concrete_Column_001_basecolor.jpg'
import columnNormalSource from '../textures/concrete2/Concrete_Column_001_normal.jpg'
import columnOccSource from '../textures/concrete2/Concrete_Column_001_ambientOcclusion.jpg'

export default class Column{
    constructor(addTo, position){
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

        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(.4, .4, 10, 100),
            new THREE.MeshStandardMaterial({
                map: this.columnTexture,
                aoMap: this.columnOccTexture,
                normalMap: this.columnNormalTexture,
            })
        )

        this.mesh.position.set(position.x, position.y, position.z)
        addTo.group.add(this.mesh)
    }
}