import { useState } from 'react'
import { useRouter } from 'next/router'
import { useCursor, MeshDistortMaterial } from '@react-three/drei'

export default function Planet(props: any) {
  return (
    <mesh
      position={props.position}>
      <sphereGeometry args={[0.2, 64, 64]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}
