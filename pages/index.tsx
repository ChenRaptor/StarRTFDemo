// Import Generator
import { CubeSector } from '../modules/SpaceGenerator/SpaceGenerator.type'
import { EffectComposer, SelectiveBloom, Selection, Select } from '@react-three/postprocessing'
// Import Module
import React, { useState, useContext, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import InterfaceGUI from '@/components/InterfaceGUI/InterfaceGUI'
// Import Context
import { OptionGenerationContext } from '@/context/OptionGeneration'
import { OrbitControls } from "@react-three/drei"
import Star from '@/components/Object/Star/Star2'
// Export default
import * as POSTPROCESSING from 'postprocessing'
import Planet from '@/components/Object/Planet/Planet2'


const postprocessing = {
  bloomEffect: {
    blendFunction: POSTPROCESSING.BlendFunction.SCREEN,
    kernelSize: POSTPROCESSING.KernelSize.HUGE,
    luminanceThreshold: 0,
    luminanceSmoothing: 0,
    intensity: 4,
    scale: 1,
    height: 1080,
    opacity: 1
  },
  depthOfFieldEffect: {
    focusDistance: 0.0,
    focalLength: 5,
    bokehScale: 4,
    height: 480
  },
  brightnessContrastEffect: {
    blendFunction: POSTPROCESSING.BlendFunction.OVERLAY,
    brightness: 1,
    contrast: 1,
    opacity: 1
  }
}

export default function Index () {
    
    const [galaxyCubeMap, setGalaxyCubeMap] = useState<CubeSector[][][]>()
    //const [optionGeneration, setOptionGeneration] = useState<OptionGeneration>(defaultOptionGeneration)

    const [moveX, setMoveX] = useState(0)
    const [moveY, setMoveY] = useState(0)
    const [moveZ, setMoveZ] = useState(0)
    const [nJump, setNJump] = useState(1)

    const goToX = (h : number) => setMoveX(moveX + h)
    const goToY = (h : number) => setMoveY(moveY + h)
    const goToZ = (h : number) => setMoveZ(moveZ + h)



    //useEffect(() => setGalaxyCubeMap(spaceGenerator(optionGeneration)) ,[moveX,moveY,moveZ])

    const OptionGenerationContextValue = useContext(OptionGenerationContext)


      return (
        <>
        <OptionGenerationContext.Provider value={OptionGenerationContextValue}>
            <main>
                <InterfaceGUI/>
                <Canvas
                  camera={{ position: [0, 0, 3] }}
                  gl={{
                    powerPreference: "high-performance",
                    alpha: true,
                    antialias: true,
                    stencil: false,
                    depth: true
                  }}
                >
                  <OrbitControls />
                  <color attach="background" args={["#000000"]} />
                  <fog color="#161616" attach="fog" near={8} far={30} />
                  <Suspense fallback={<p>Loading</p>}>

                     <Planet />
                     <pointLight position={[0, 1, 0]} />
                     <ambientLight />

                  <Selection>
                      <EffectComposer>
                        <SelectiveBloom
                          lights={[]}
                          selection={[]}
                          luminanceThreshold={0}
                          luminanceSmoothing={0.3}
                          height={500}
                          opacity={2}
                          kernelSize={5}
                          intensity={6}
                        />
                      </EffectComposer>
                      <Select enabled>
                        <Star />
                      </Select>
                    </Selection>


                  </Suspense>
                </Canvas>
            </main>
        </OptionGenerationContext.Provider>
        </>
      )

}






/*

                    <Selection>
                      <EffectComposer>
                      <SelectiveBloom
                        lights={[]}
                        selection={[]}
                        luminanceThreshold={0}
                        luminanceSmoothing={0.3}
                        height={500}
                        opacity={2}
                        kernelSize={5}
                        intensity={6}
                      />
                      </EffectComposer>
                      <Select enabled>
                        <Star />
                      </Select>
                    </Selection>

                    <EffectComposer>
                      <SelectiveBloom
                        lights={[]}
                        selection={[meshRef]}
                        luminanceThreshold={0}
                        luminanceSmoothing={0.3}
                        height={500}
                        opacity={2}
                        kernelSize={5}
                        intensity={6}
                      />
                    </EffectComposer>


function Appa() {
  return (
    <Canvas>
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  )


                    <EffectComposer>
                  <GodRays
                  sun={new THREE.MeshBasicMaterial()}
    blendFunction={BlendFunction.NORMAL} // The blend function of this effect.
    samples={60} // The number of samples per pixel.
    density={0.96} // The density of the light rays.
    decay={0.9} // An illumination decay factor.
    weight={0.4} // A light ray weight factor.
    exposure={0.6} // A constant attenuation coefficient.
    clampMax={1} // An upper bound for the saturation of the overall effect.
    kernelSize={5} // The blur kernel size. Has no effect if blur is disabled.
  />
      </EffectComposer>
}*/