import CircleComponent from './CircleComponent';
import PlanetComponent from './PlanetComponent';
import StarComponent from './StarComponent';

export default function SystemComponent(props: any) {

  let {matrice1D,indexX,length1,indexY,length2,indexZ,length3,onClick} = props
  let {x,y,z} = matrice1D.system.position
  
  return (
    <group 
    name={matrice1D.system.name}
    >
        <StarComponent
        normal={matrice1D.system.normal}
        onClick={onClick}
        size={0.05} 
        position={[indexX - length1/2 + 0.5 + x,indexY - length2/2 + 0.5 + y,indexZ - length3/2 + 0.5 + z]} 
        color={0xffffff}/>
        <CircleComponent 
        vector={matrice1D.system.normal} 
        size={0.5} 
        position={[indexX - length1/2 + 0.5 + x,indexY - length2/2 + 0.5 + y,indexZ - length3/2 + 0.5 + z]} 
        color={0x2ff955}/>
        {
            matrice1D.system.collection.map((item : any) => <PlanetComponent
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
    </group>
  )
}

                            