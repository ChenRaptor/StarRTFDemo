import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three"
import { Light, MeshBasicMaterial, PointLight } from "three";



const vertexShader = `
precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vEyeVector;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
    vPosition = position;
    vEyeVector = normalize(modelPosition.xyz - cameraPosition);
}
`;

const fragmentShader = `
precision mediump float;

uniform vec3 uColor;
uniform float uTime;
uniform float uBrightnessAmplifier;
uniform float uNoiseIntensity;
uniform float uNoiseSpeed;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform float uColorAmplifierPrimary;
uniform float uColorAmplifierSecondary;
uniform float uColorAmplifierTertiary;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vEyeVector;

// START - Noise traditional formula
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//
vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float mod289(float x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
{
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

    return p;
}

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
{
    const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
    0.276393202250021,  // 2 * G4
    0.414589803375032,  // 3 * G4
    -0.447213595499958); // -1 + 4 * G4

    // First corner
    vec4 i  = floor(v + dot(v, vec4(F4)) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

    // Other corners

    // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    //  i0.x = dot( isX, vec3( 1.0 ) );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    // i0 now contains the unique values 0,1,2,3 in each channel
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    //  x0 = x0 - 0.0 + 0.0 * C.xxxx
    //  x1 = x0 - i1  + 1.0 * C.xxxx
    //  x2 = x0 - i2  + 2.0 * C.xxxx
    //  x3 = x0 - i3  + 3.0 * C.xxxx
    //  x4 = x0 - 1.0 + 4.0 * C.xxxx
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;

    // Permutations
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
    i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
    + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
    + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
    + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
    // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

    // Mix contributions from the five corners
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
    + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
// END - Noise traditional formula

// creating octave (layer) of noise
float noiseOctave(vec4 layer)
{
    float noiseOctaveOffset = 500.0;
    float noiseAmplitude = 1.0;
    float noiseScale = 1.0;

    float sum = 0.0;

    for(int i=0; i<6; i++)
    {
        // adding layers of noise on each other
        // with different scale and amplitude
        sum += snoise(layer * noiseScale) * noiseAmplitude;

        // tuning down amplitude
        noiseAmplitude *= 0.8;

        // tuning up scale
        noiseScale *= 2.0;

        // offseting each layer by the time
        layer.w += noiseOctaveOffset;
    }

    return sum;
}

// convert perceptible brightness to sun color
vec3 convertBrightToColor(float brightness)
{
    float brightnessAmplifier = uBrightnessAmplifier;

    brightness *= brightnessAmplifier;

    // add uniform for color pow here to change color on diff universes
    vec3 color = vec3(
      clamp(pow(brightness, uColorAmplifierPrimary), 0., 1.),
      clamp(pow(brightness, uColorAmplifierSecondary), 0., 1.), 
      clamp(pow(brightness, uColorAmplifierTertiary), 0., 1.)
    ); 

    //if (color.r > 0.5 && color.g >= 0.5 && color.b >= 0.5) {
    //  color = vec3(0.0,0.0,0.0);
    //}


    return color;
}

// calucate the fresnel of the object
float fresnel(vec3 eyeVector, vec3 worldNormal)
{
    return pow(1.0 + dot(eyeVector, worldNormal), 3.0);
}

void main()
{
    float noiseIntensity = uNoiseIntensity;
    float noiseSpeed = uNoiseSpeed;
    float fresnelAmplifier = 0.01;


    vec4 baseColor = vec4(0.5,0.7,0.5,1.0);

    vec4 baseLayer = vec4(vPosition,1.0);

    gl_FragColor = (baseColor + baseLayer)/2.;

    //gl_FragColor = baseColor * regionNoises;

    //vec4 baseLayer = vec4(vPosition,1.0);

    //float noises = noiseOctave(baseLayer);

    //float regionNoises = max(snoise(baseLayer), 0.0);

    //float smoothRegionNoises = mix(1.0, regionNoises, 0.7);

    //float smoothedLayersOfNoises = noises * smoothRegionNoises;

    //smoothedLayersOfNoises += fresnel(vEyeVector, vPosition) * fresnelAmplifier;

    //gl_FragColor = baseLayer * smoothedLayersOfNoises * 4.0;

}
`;

const GasGiantProps = {
  scale: {
    min: 5000,
    max: 15000
  },
  uBrightnessAmplifier: {
    min: 0.2,
    max: 0.25
  },
  uNoiseIntensity: {
    min: 2.0,
    max: 8.0
  },
  uNoiseSpeed: {
    min: 0.03,
    max: 0.08
  },
  uColorAmplifier: {
    primary: 0.0,
    secondary: 1.0,
    tertiary: 1.0
  }
};


const GasGiant = () => {
  const meshRef = useRef<any>();
  const { gl, camera, scene } = useThree();

  useFrame(({ clock }) => {
    meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    //meshRef.current.material.uniforms.ratio_step_1.value = clock.getElapsedTime()/10;
  });



  scene.fog = new THREE.Fog('#ffffff',0,300)

    return (
      <>
          <mesh ref={meshRef} position={[2,0,0]}>
            <sphereGeometry args={[0.2, 64, 64]}/>
            <shaderMaterial 
                  precision={'highp'}
                  vertexShader={vertexShader}
                  fragmentShader={fragmentShader}
                  uniforms= {{
                    uTime: { value: 0 },
                    uBrightnessAmplifier: {
                      value: THREE.MathUtils.randFloat(
                        GasGiantProps.uBrightnessAmplifier.min,
                        GasGiantProps.uBrightnessAmplifier.max
                      )
                    },
                    uNoiseIntensity: {
                      value: THREE.MathUtils.randFloat(
                        GasGiantProps.uNoiseIntensity.min,
                        GasGiantProps.uNoiseIntensity.max
                      )
                    },
                    uNoiseSpeed: {
                      value: THREE.MathUtils.randFloat(
                        GasGiantProps.uNoiseSpeed.min,
                        GasGiantProps.uNoiseSpeed.max
                      )
                    },
                    uColorAmplifierPrimary: { 
                      value: GasGiantProps.uColorAmplifier.primary
                    },
                    uColorAmplifierSecondary: { 
                      value: GasGiantProps.uColorAmplifier.secondary
                    },
                    uColorAmplifierTertiary: { 
                      value: GasGiantProps.uColorAmplifier.tertiary
                    },
                    fogColor: { value: scene.fog.color },
                    fogNear: { value: (scene.fog as any).near },
                    fogFar: { value: (scene.fog as any).far }
                  }}
                  side={THREE.FrontSide}
                  fog={true}
            />
        </mesh>
      </>
    );
}

export default GasGiant;