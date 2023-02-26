import spaceGenerator from '../modules/SpaceGenerator/SpaceGenerator'
import { CubeSector, Matrice3D } from '../modules/SpaceGenerator/SpaceGenerator.type'
import { System } from '../modules/SystemGenerator/SystemGenerator.type'
import { useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import SystemComponent from '@/components/SystemComponent'
import Head from 'next/head'
import { OrbitControls } from '@react-three/drei'
import AppCanvasComponent from '@/components/AppCanvasComponent'

export default function Index() {
    const [galaxyCubeMap, setGalaxyCubeMap] = useState<CubeSector[][][]>()
    const [moveX, setMoveX] = useState(0)
    const [moveY, setMoveY] = useState(0)
    const [moveZ, setMoveZ] = useState(0)
    const [nbJump, setNbJump] = useState(1)

    const goToX = (h : number) => {
        setMoveX(moveX + h)
    }
    const goToY = (h : number) => {
        setMoveY(moveY + h)
    }
    const goToZ = (h : number) => {
        setMoveZ(moveZ + h)
    }

    useEffect(() => {
        let result = spaceGenerator({galaxySize: {x: 60, y: 60, z: 5},position: {x: moveX, y: moveY, z: moveZ}});
        console.log(result)
        setGalaxyCubeMap(result);
      },[moveX,moveY,moveZ])


      return (
        <>
        <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
            <button onClick={() => goToX(nbJump)}>Move X+</button>
            <button onClick={() => goToY(nbJump)}>Move Y+</button>
            <button onClick={() => goToZ(nbJump)}>Move Z+</button>
            <button onClick={() => goToX(-nbJump)}>Move X-</button>
            <button onClick={() => goToY(-nbJump)}>Move Y-</button>
            <button onClick={() => goToZ(-nbJump)}>Move Z-</button>
            <button onClick={() => setNbJump(nbJump + 1)}>nbJump + : {nbJump}</button>
            <button onClick={() => setNbJump(nbJump - 1)}>nbJump - : {nbJump}</button>
            <Canvas gl={{ antialias: false, stencil: false }} camera={{ position: [30, 0, 0], fov: 80 }}>
                <AppCanvasComponent galaxyCubeMap={galaxyCubeMap}/>
            </Canvas>
        </main>
        </>
      )

}
