import { Vector3, Euler, Quaternion } from 'three';

// ...

export default function SystemComponent(props: any) {

  // Définir le vecteur normal pour le plan sur lequel le cercle sera placé
  const planeNormal = new Vector3(props.vector.x, props.vector.y, props.vector.z); // Remplacez ce vecteur par le vecteur normal du plan souhaité

  // Calculer la rotation nécessaire pour aligner le plan avec l'orientation du cercle
  const upDirection = new Vector3(0, 0, 0); // Direction vers le haut
  const rotationQuaternion = new Quaternion().setFromUnitVectors(upDirection, planeNormal);

  // Convertir le quaternion en une instance d'Euler pour l'utiliser comme rotation de la mesh
  const rotationEuler = new Euler().setFromQuaternion(rotationQuaternion);

  // Retourner le cercle avec une rotation appliquée pour le placer sur le plan souhaité
  return (
    <mesh position={props.position} rotation={rotationEuler}>
      <circleGeometry args={[props.size ?? 0.2, 32]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}