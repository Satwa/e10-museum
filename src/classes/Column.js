import * as THREE from "three"

import columnSource from '../textures/concrete2/a9oct-09z6f.dds'
import columnNormalSource from '../textures/concrete2/airih-9md6o.dds'
import columnOccSource from '../textures/concrete2/aacfz-6m3ue.dds'

export default class Column{
    constructor(addTo, position, height = 10){
        this.context = addTo.context

        this.columnTexture = this.context.textureDSSLoader.load(columnSource)
        this.columnTexture.repeat.x = 20
        this.columnTexture.repeat.y = 20
        this.columnTexture.wrapS = THREE.RepeatWrapping
        this.columnTexture.wrapT = THREE.RepeatWrapping
        this.columnNormalTexture = this.context.textureDSSLoader.load(columnNormalSource)
        this.columnNormalTexture.wrapS = THREE.RepeatWrapping
        this.columnNormalTexture.wrapT = THREE.RepeatWrapping
        this.columnOccTexture = this.context.textureDSSLoader.load(columnOccSource)
        this.columnOccTexture.wrapS = THREE.RepeatWrapping
        this.columnOccTexture.wrapT = THREE.RepeatWrapping

        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(.4, .4, height, 100),
            new THREE.MeshStandardMaterial({
                map: this.columnTexture,
                aoMap: this.columnOccTexture,
                normalMap: this.columnNormalTexture,
            })
        )

        this.mesh.position.set(position.x, position.y + height/2, position.z)
        addTo.group.add(this.mesh)
    }
}