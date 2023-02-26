import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useCursor, MeshDistortMaterial } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'


export default function SystemComponent(props: any) {
  const mesh = useRef()

  const [hovered, setHover] = useState(false)

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
