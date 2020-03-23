import * as THREE from 'three'

export default class LoadingScreen{

    constructor(){
        this.group = new THREE.Group()

        const cone = new THREE.Mesh(
            new THREE.ConeGeometry(17.5, 21, 4), 
            new THREE.MeshBasicMaterial({color: 0xffff00})
        )
        this.group.add(cone)
    }

}