import * as THREE from "three"

export default class Bench {
    constructor(addTo, position = new THREE.Vector3(), rotation = new THREE.Vector3(0, -Math.PI / 12, 0)) {
        this.context = addTo.context

        this.context.gltfLoader.load('/models/bench/Bench.gltf', (_gltf) => {
            const bench = _gltf.scene

            bench.scale.set(.04, .04, .04)
            
            bench.rotation.set(rotation.x, rotation.y, rotation.z)
            // y + .5 is to fix gap from scale
            bench.position.set(position.x, position.y + .5, position.z)

            addTo.group.add(bench)
        })
    }
}