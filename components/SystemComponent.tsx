import { Vector3, Euler, Quaternion } from 'three';

export default function SystemComponent(props: any) {

  const planeNormal = new Vector3(props.vector.x, props.vector.y, props.vector.z); 
  const upDirection = new Vector3(0, 0, 1); 
  const rotationQuaternion = new Quaternion().setFromUnitVectors(upDirection, planeNormal);
  const rotationEuler = new Euler().setFromQuaternion(rotationQuaternion);

  return (
    <mesh position={props.position} rotation={rotationEuler}>
      <circleGeometry args={[props.size ?? 0.2, 32]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}