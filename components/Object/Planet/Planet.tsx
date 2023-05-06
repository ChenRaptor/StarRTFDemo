import { useRef } from "react"
import * as THREE from "three"
/*
export default function Planet () {
  
    // Chargement du cubemap
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    const cubeTexture = cubeTextureLoader.load([
      'wp4471392.jpg',
      'wp4471392.jpg',
      'wp4471392.jpg',
      'wp4471392.jpg',
      'wp4471392.jpg',
      'wp4471392.jpg',
    ])

    return (
        <mesh position={[1.5,0,0]}>
            <sphereGeometry args={[0.1, 64, 64]}/>
            <meshBasicMaterial envMap={cubeTexture} />
        </mesh>
    )
}*/



// Vertex shader
const vertexShader = `
    varying vec3 vWorldPosition;

    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`
// Fragment shader
const fragmentShader = `
uniform samplerCube cubeMap;
varying vec3 vWorldPosition;

void main() {
  vec3 worldNormal = normalize(vWorldPosition.xyz);
  vec4 cubeColor = textureCube(cubeMap, worldNormal);

  gl_FragColor = vec4(cubeColor.rgb, 1.0);
}
`

export default function Planet () {
  
  // Chargement du cubemap
  const cubeTextureLoader = new THREE.CubeTextureLoader()
  const cubeTexture = cubeTextureLoader.load([
    'wp4471392.jpg',
    'wp4471392.jpg',
    'wp4471392.jpg',
    'wp4471392.jpg',
    'wp4471392.jpg',
    'wp4471392.jpg',
  ])

  // Création du matériau
  return (
    <mesh position={[1.5, 0, 0]}>
      <sphereGeometry args={[0.1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          cubeMap: { value: cubeTexture },
        }}
      />
    </mesh>
  )
}