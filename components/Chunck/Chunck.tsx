import { useRef } from "react";
import { AdditiveBlending } from "three";

const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
void main() {
  gl_FragColor = vec4(0.0,0.0,1.0, 0.1);
}
`;

export default function Chunck () {
    const meshRef = useRef<any>();


    return (
        <mesh ref={meshRef} position={[0,0,0]}>
            <boxGeometry args={[1, 1, 1]} />
            <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            blending={AdditiveBlending}
            transparent={true}/>
        </mesh>
    )
}