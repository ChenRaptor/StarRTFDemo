import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useCursor, MeshDistortMaterial } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'


export default function SystemComponent(props: any) {
  const mesh = useRef()

  const [hovered, setHover] = useState(false)
  /*
  const { gl, camera } = useThree();

  let isClick = false
  let isClickPosition = {
    x: 0,
    y: 0,
    z: 0
  }

  let oldPos  = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  }

  useFrame((state, delta) => {
    if (isClick) {
      gsap.to(camera.position, {
        x: () => 0,
        y: () => 0,
        duration: 4
      }) 
    } 
    if (!isClick) {
      gsap.to(camera.position, {
        x: () => oldPos.x,
        y: () => oldPos.y,
        duration: 4
      })
    }

  })

  const onClick = (object : any) => {
    console.log(object.position)
    isClick = true
    isClickPosition = object.position
  }

*/
  return (
    <mesh
      name={props.name}
      position={props.position}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      onClick={(event) => props.onClick(event.eventObject)}
      >
      <sphereGeometry args={[props.size ?? 0.2, 64, 64]} />
      <meshStandardMaterial color={hovered ? 'orange' : props.color} />
      
    </mesh>
  )
}
