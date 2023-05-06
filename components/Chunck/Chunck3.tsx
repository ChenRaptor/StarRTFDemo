import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { AdditiveBlending, BackSide } from "three";
import * as THREE from 'three';
import noise from '@/libs/Noise'
import {ImprovedNoise} from '../../libs/ImprovisedNoise'

const vertexShader = `
varying vec3 vPosition;

void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec3 vPosition;

void main() {
  vec3 color = vec3(0.0);
  // calcul de la couleur basée sur la position
  color.r = abs(vPosition.x);
  color.g = abs(vPosition.y);
  color.b = abs(vPosition.z);
  if (color.r > 0.2) {
    discard;
  }
  else {
    gl_FragColor = vec4(color, 1.0);
  }
}
`;

const vertexShader2 = `
varying vec3 vPosition;

void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader2 = `
varying vec3 vPosition;

void main() {
  vec3 color = vec3(0.0);
  
  // Centre de la sphère
  vec3 sphereCenter = vec3(0.5, 0.5, 0.5);
  
  // Rayon de la sphère
  float sphereRadius = 0.5;
  
  // Calcul de la distance entre le point et le centre de la sphère
  float distanceToSphere = length(vPosition - sphereCenter);
  
  if (distanceToSphere < sphereRadius) {
    // Le point est à l'intérieur de la sphère
    color = vec3(1.0, 0.0, 0.0);
    gl_FragColor = vec4(color, 1.0);
  } else {
    // Le point est à l'extérieur de la sphère
    color = vec3(0.0, 0.0, 0.0);
    discard;
  }
  
}
`;

const vertexShader3 = `
varying vec3 vPosition;

void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader3 = `
precision highp sampler3D;
precision highp float;
varying vec3 vPosition;
uniform sampler3D map;

void main() {
    vec3 voxelPosition = vPosition * 0.5 + vec3(0.5);
    float density = texture(map, vPosition).r;
    vec4 color = vec4(1.0, 1.0, 1.0, (density * 50.0) + 0.5);
    gl_FragColor = color;
}
`;

export default function Chunck () {
    const meshRef = useRef<any>();

    const [map,setMap] = useState<any>(null)

    const generateMap = () => {
        const size = 128;
        const data = new Uint8Array( size * size * size );
    
        let i = 0;
        const scale = 0.1;
        const vector = new THREE.Vector3();
        const perlin = new ImprovedNoise();
    
        for ( let z = 0 + size; z < size + size; z ++ ) {
    
            for ( let y = 0; y < size; y ++ ) {
    
                for ( let x = 0; x < size; x ++ ) {
    
                    const d = 1.0 - vector.set( x, y, z ).subScalar( size / 2 ).divideScalar( size ).length();
                    data[ i ] = ( 128 + 128 * perlin.noise( x * scale / 1.5, y * scale, z * scale / 1.5 ) ) * d * d;
                    i ++;
    
                }
    
            }
    
        }
    
        const texture = new THREE.Data3DTexture( data, size, size, size );
        texture.format = THREE.RedFormat;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;
        texture.needsUpdate = true;
        return texture
    }

    useEffect(() => {
        const mapN = generateMap()
        console.log(mapN)
        setMap(mapN)
    },[])



    useFrame(({ clock }) => {
      //meshRef.current.rotation.y += 0.001;
      meshRef.current.material.uniforms.time.value = clock.getElapsedTime();
    });
    return (
        <mesh ref={meshRef} position={[0,0,0]}>
            <boxGeometry args={[1, 1, 1]} />
            <shaderMaterial 
            vertexShader={vertexShader3}
            fragmentShader={fragmentShader3}
            blending={AdditiveBlending}
            uniforms={{
              time: { value: 0 },
              map: { value: map},
              base: { value: new THREE.Color( 0xff0000 ) },
            }}/>
        </mesh>
    )
}