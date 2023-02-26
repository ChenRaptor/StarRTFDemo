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
    let oldPos : any = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    }

    useFrame((state, delta) => {
        isClickPosition && camera.lookAt(isClickPosition)
        if (isClick) {
            gsap.to(camera.position, {
                x: () => isClickPosition.x + 0.1,
                y: () => isClickPosition.y + 0.1,
                z: () => isClickPosition.z + 0.1,
                duration: 4
            }).then(() => {
                isClick = false;
                oldPos = {
                    x: isClickPosition.x + 0.1,
                    y: isClickPosition.y + 0.1,
                    z: isClickPosition.z + 0.1
                }
            })
        } 
    })

    const onClick = (object : any) => {
        console.log(object.position)
        isClickPosition = object.position
        camera.lookAt(isClickPosition)
        isClick = true
    }
    
    return (
        <>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={true} enablePan={false} />
        <>
        {galaxyCubeMap?.map((matrice3D, indexX) => 
            matrice3D?.map((matrice2D, indexY) => 
                matrice2D?.map((matrice1D, indexZ) => {
                    if (matrice1D.hasSystem) {
                        matrice1D.system = matrice1D.system as System;
                        const length1 = (galaxyCubeMap?.[1] ?? []).length
                        const length2 = matrice3D.length
                        const length3 = matrice2D.length
                        let {x,y,z} = matrice1D.system.position
                        return (
                            <>
                            <StarComponent name={matrice1D.system.name} onClick={onClick} size={0.05} position={[indexX - length1/2 + 0.5 + x,indexY - length2/2 + 0.5 + y,indexZ - length3/2 + 0.5 + z]} color={0xffffff}/>
                            <SystemComponent vector={matrice1D.system.normal} size={1} position={[indexX - length1/2 + 0.5 + x,indexY - length2/2 + 0.5 + y,indexZ - length3/2 + 0.5 + z]} color={0x2ff955}/>
                            {
                                matrice1D.system.collection.map((item) => <PlanetComponent 
                                position={
                                    [
                                        indexX - length1/2 + 0.5 + item.pos.x,
                                        indexY - length2/2 + 0.5 + item.pos.y,
                                        indexZ - length3/2 + 0.5 + item.pos.z
                                    ]
                                }
                                color={'orange'}
                                />)
                            } 
                            </>
                        )
                    }
                }
            )))
        }
        </>
        </>
    )
}