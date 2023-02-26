import { OrbitControls } from '@react-three/drei'
import SystemComponent from '@/components/SystemComponent'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'

export default function AppCanvasComponent ({galaxyCubeMap} : any) {
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
        {galaxyCubeMap?.map((matrice3D : any, indexX:number) => 
            matrice3D?.map((matrice2D : any, indexY:number) => 
                matrice2D?.map((matrice1D : any, indexZ:number) => {
                    if (matrice1D.hasSystem) {
                        const length1 = (galaxyCubeMap?.[1] ?? []).length
                        const length2 = matrice3D.length
                        const length3 = matrice2D.length
                        let {x,y,z} = matrice1D.system.position
                        return (
                            <SystemComponent name={matrice1D.system.name} onClick={onClick} size={0.05} position={[indexX - length1/2 + 0.5 + x,indexY - length2/2 + 0.5 + y + x,indexZ - length3/2 + 0.5 + z]} color={0xffffff}/>
                        )
                    }
                }
            )))
        }
        </>
        </>
    )
}