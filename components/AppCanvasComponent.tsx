import { OrbitControls } from '@react-three/drei'
import StarComponent from '@/components/StarComponent'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import SystemComponent from './SystemComponent';
import { CubeSector } from '@/modules/SpaceGenerator/SpaceGenerator.type';
import { System } from '@/modules/SystemGenerator/SystemGenerator.type';
import PlanetComponent from './PlanetComponent';

export default function AppCanvasComponent ({galaxyCubeMap} : {galaxyCubeMap: CubeSector[][][] | undefined}) {
    const { gl, camera } = useThree();
    let isClick = false;
    let isClickPosition : any = null;
    let isClickAngle : any = null;
    let oldPos : any = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    }

    useFrame((state, delta) => {
        isClickPosition && camera.lookAt(isClickPosition)
        if (isClick) {
            gsap.to(camera.position, {
                x: () => isClickPosition.x + isClickAngle.x,
                y: () => isClickPosition.y + isClickAngle.y,
                z: () => isClickPosition.z + isClickAngle.z,
                duration: 2
            }).then(() => {
                isClick = false;
                oldPos = {
                    x: isClickPosition.x + isClickAngle.x,
                    y: isClickPosition.y + isClickAngle.y,
                    z: isClickPosition.z + isClickAngle.z
                }
            })
        } 
    })

    const onClick = (object : any, normal : any) => {
        console.log(object.position)
        isClickPosition = object.position
        isClickAngle = normal

        camera.lookAt(isClickPosition)
        isClick = true
    }
    
    return (
        <>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={true} enablePan={false} />
        <>
        {
        galaxyCubeMap?.map((matrice3D, indexX) => 
        matrice3D?.map((matrice2D, indexY) => 
        matrice2D?.map((matrice1D, indexZ) => {
        if (matrice1D.hasSystem) {
            matrice1D.system = matrice1D.system as System;
                const length1 = (galaxyCubeMap?.[1] ?? []).length
                const length2 = matrice3D.length
                const length3 = matrice2D.length
                return (
                    <SystemComponent 
                    length1={length1}
                    length2={length2}
                    length3={length3}
                    indexX={indexX}
                    indexY={indexY}
                    indexZ={indexZ}
                    matrice1D={matrice1D}
                    onClick={onClick}
                    />
                )
        }})))}
        </>
        </>
    )
}