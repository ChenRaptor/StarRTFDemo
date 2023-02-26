import noise3d from '../../libs/Noise'
import {v4 as uuidv4} from 'uuid';
import CryptoJS from 'crypto-js';
import { OptionSpaceGeneration, OptionSpaceGenerationExtended, CubeSector } from './SpaceGenerator.type';
import { System } from '../SystemGenerator/SystemGenerator.type';
import systemGenerator from '../SystemGenerator/SystemGenerator';

function getPropsGeneration (props: OptionSpaceGenerationExtended) {
  if (typeof props.galaxySize === 'number') props.galaxySize = { x: props.galaxySize, y: props.galaxySize, z: props.galaxySize }
  return props as OptionSpaceGeneration;
}

function hasSystemInCubeSector(noiseValue: number) {
  return parseInt(CryptoJS.SHA256(noiseValue.toString()).toString().substring(0, 16), 16) / 2 ** 64 < noiseValue ? true : false;
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