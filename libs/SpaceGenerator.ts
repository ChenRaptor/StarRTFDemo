import noise3d from './Noise'
import {v4 as uuidv4} from 'uuid';
import CryptoJS from 'crypto-js';

export interface OptionSpaceGeneration {
    galaxySize: number | {
      x: number,
      y: number,
      z: number
    }
    position: {
      x: number
      y: number
      z: number
  }
}

export interface System {
    id: string
    position: {
        x: number
        y: number
        z: number
    }
    value: number,
    hasSystem: boolean
    systems: {
      position: {x: number, y: number, z: number}
    }
}

export type Matrice1D = any
export type Matrice2D = Matrice1D[]
export type Matrice3D = Matrice2D[]

function xorshift(seed: number) {
    let x = seed;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return x / 4294967296; // normalise le nombre entre 0 et 1
}

export default function SpaceGenerator({galaxySize,position}: OptionSpaceGeneration, print: string) {
    let galaxy : System[] = [];
    let matrice3D : Matrice3D = []
    let matrice3D2 : Matrice3D = []
    let noiseValue;
    let hasSystem;

    if (typeof galaxySize === 'number') {
      galaxySize = {
        x: galaxySize,
        y: galaxySize,
        z: galaxySize
      }
    }
  
    // générateur de nombres pseudo-aléatoires initialisé avec une graine donnée
  
    if (print === 'densityMap') {
      for (let x = 0; x < galaxySize.x; x++) {
        matrice3D[x] = []
        for (let y = 0; y < galaxySize.y; y++) {
          matrice3D[x][y] = []
          for (let z = 0; z < galaxySize.z; z++) {
            matrice3D[x][y][z] = noise3d((x + position.x) / galaxySize.x, (y + position.y) / galaxySize.y, (z + position.z) / galaxySize.z);
          }
        }
      }
    }
    else if (print === 'galaxyMap') {
      for (let x = 0; x < galaxySize.x; x++) {
        matrice3D[x] = []
        for (let y = 0; y < galaxySize.y; y++) {
          matrice3D[x][y] = []
          for (let z = 0; z < galaxySize.z; z++) {
            noiseValue = noise3d((x + position.x) / galaxySize.x, (y + position.y) / galaxySize.y, (z + position.z) / galaxySize.z);
            const hashValue = CryptoJS.SHA256(noiseValue.toString()).toString();
            const hashFloat = parseInt(hashValue.substring(0, 16), 16) / 2 ** 64;

            hasSystem = hashFloat < noiseValue ? true : false;

            matrice3D[x][y][z] = {
              id: uuidv4(),
              value: noiseValue,
              position: {x, y, z},
              hasSystem,
              systems: {
                position: pseudoRandomPosition(noiseValue)
              }
            };
          }
        }
      }
    }
    return [galaxy,matrice3D];
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