export default function PlanetComponent(props: any) {
  return (
    <mesh position={props.position}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}
