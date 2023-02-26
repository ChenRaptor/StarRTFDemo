import noise3d from '../../libs/Noise'
import {v4 as uuidv4} from 'uuid';
import CryptoJS from 'crypto-js';
import { System, OptionSpaceGeneration, Matrice3D, OptionSpaceGenerationExtended, CubeSector } from './SpaceGenerator.type';

function getPropsGeneration (props: OptionSpaceGenerationExtended) {
  if (typeof props.galaxySize === 'number') props.galaxySize = { x: props.galaxySize, y: props.galaxySize, z: props.galaxySize }
  return props as OptionSpaceGeneration;
}

function hasSystemInCubeSector(noiseValue: number) {
  return parseInt(CryptoJS.SHA256(noiseValue.toString()).toString().substring(0, 16), 16) / 2 ** 64 < noiseValue ? true : false;
}

function systemGenerator(noiseValue: number) {
  return {
    position: pseudoRandomPosition(noiseValue)
  } as System
}

export default function spaceGenerator(propsGeneration : OptionSpaceGenerationExtended) {
    const galaxyCubeMap: CubeSector[][][] = []; 
    let noiseValue: number,
    system: System | null = null,
    hasSystem: boolean,
    props = getPropsGeneration(propsGeneration);

    for (let x = 0; x < props.galaxySize.x; x++) {
        galaxyCubeMap[x] = []
        for (let y = 0; y < props.galaxySize.y; y++) {
          galaxyCubeMap[x][y] = []
          for (let z = 0; z < props.galaxySize.z; z++) {

            noiseValue = noise3d(
              (x + props.position.x) / props.galaxySize.x, 
              (y + props.position.y) / props.galaxySize.y, 
              (z + props.position.y) / props.galaxySize.z
            );

            hasSystem = hasSystemInCubeSector(noiseValue);
            system = hasSystem ? systemGenerator(noiseValue) : null

            galaxyCubeMap[x][y][z] = {
              id: uuidv4(),
              coord: {x, y, z},
              density: noiseValue,
              hasSystem,
              system,
            };
          }
        }
      }
    return galaxyCubeMap;
}













function pseudoRandomPosition(noiseValue : number) {
  const x = CryptoJS.SHA256(noiseValue.toString()).toString().slice(0, 16); // prendre 16 premiers caractères
  const y = CryptoJS.SHA256(x).toString().slice(0, 16); // prendre 16 premiers caractères
  const z = CryptoJS.SHA256(y).toString().slice(0, 16); // prendre 16 premiers caractères
  const position = {
    x: parseInt(x, 16) / parseInt("ffffffffffffffff", 16), // diviser par le plus grand nombre hexadécimal de 64 bits
    y: parseInt(y, 16) / parseInt("ffffffffffffffff", 16),
    z: parseInt(z, 16) / parseInt("ffffffffffffffff", 16),
  };
  return position;
}