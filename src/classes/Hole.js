import * as THREE from "three"
import {ThreeBSP} from 'three-js-csg-es6'

export default class HoleDigger {
    constructor(originalGeometry, holeGeometry, material, holePosition = new THREE.Vector3(), holeRotation = new THREE.Vector3()) {
        const originalMesh = new ThreeBSP(new THREE.Mesh(originalGeometry))
        
        const _holeMesh = new THREE.Mesh(holeGeometry)
        _holeMesh.position.set(holePosition.x, holePosition.y, holePosition.z)
        _holeMesh.rotation.set(holeRotation.x, holeRotation.y, holeRotation.z)
        
        const holeMesh = new ThreeBSP(_holeMesh)
        const theBoringGeometry = originalMesh.subtract(holeMesh) // do you have the ref, dear Elon?

        this.mesh = theBoringGeometry.toMesh()
        this.mesh.material = material
    }

    getMesh(){
        return this.mesh
    }
}