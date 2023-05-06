import { System } from "./SystemGenerator.type";
import CryptoJS from 'crypto-js';
import { rng, randomNumber } from "@/libs/Noise"; 


export default function systemGenerator(noiseValue : any) {
    const nbPlanet = randomNumber(noiseValue);
    const getRandom = rng(noiseValue.toString())
    const collection = [];
    const position = pseudoRandomPosition(noiseValue);
    const normal = generateVertorNormal(getRandom)

    for (let i = 0; i < nbPlanet; i++) collection[i] = generatePlanet(getRandom,normal,position)

    return {
        position,
        name: generateSystemName(),
        normal,
        nbPlanet,
        collection
      } as System
}


function generateVertorNormal(getRandom : any) {
  const nx = getRandom() * 2 - 1 // valeur entre -1 et 1 pour la composante x
  const ny = getRandom() * 2 - 1 // valeur entre -1 et 1 pour la composante y
  const nz = getRandom() * 2 - 1 // valeur entre -1 et 1 pour la composante z
  const norm = Math.sqrt(nx * nx + ny * ny + nz * nz)
  return { x: nx / norm, y: ny / norm, z: nz / norm }
}

interface Point {
    x: number;
    y: number;
    z: number;
  }
  
  function distance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function vect(p1 : Point, p2: Point) {
    return {
      x: p2.x - p1.x,
      y: p2.y - p2.y,
      z: p2.z - p2.z
    }
  }

  function generate(n: any, p: any, maxDist: number) {

    const equation = { 
        a: n.x, 
        b: n.y, 
        c: n.z, 
        d: -n.x * p.x - n.y * p.y - n.z * p.z
    }

    let x, y, z, dist

    do {
        x = Math.random() * (4 - 0) + 0
        y = Math.random() * (4 - 0) + 0
        z = -(equation.a*x + equation.b*y + equation.d) / equation.c

        dist = distance(p, { x, y, z })
    } while (dist > 0.2)

    return { x, y, z }
}

function generatePlanet(getRandom : any, normal : any, position : any) {
    const planet: any = {}
  
    // Générer la composition de la planète
    const composition = ['terre', 'roche', 'gaz'][Math.floor(Math.abs(getRandom()) * 3)]
    planet.composition = composition
  
    // Générer l'atmosphère de la planète
    const atmosphere = ['oxygène', 'méthane', 'azote'][Math.floor(Math.abs(getRandom()) * 3)]
    planet.atmosphere = atmosphere
  
    // Générer la végétation de la planète
    const vegetation = ['aucune', 'arbres', 'herbe'][Math.floor(Math.abs(getRandom()) * 3)]
    planet.vegetation = vegetation 

    planet.pos = generate(normal,position,0.5)
  
    return planet
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

function generateSystemName(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const vowels = "AEIOU";
    const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
    const numbers = "0123456789";

    // Generate a random number of syllables between 2 and 4
    const numSyllables = Math.floor(Math.random() * 3) + 2;

    // Generate a random letter from A to Z
    const firstLetter = letters.charAt(Math.floor(Math.random() * letters.length));

    let systemName = firstLetter;

    // Generate each syllable of the system name
    for (let i = 0; i < numSyllables; i++) {
        let syllable = "";

        // Determine if the syllable should start with a vowel or consonant
        if (i % 2 === 0) {
        syllable += vowels.charAt(Math.floor(Math.random() * vowels.length));
        syllable += consonants.charAt(Math.floor(Math.random() * consonants.length));
        } else {
        syllable += consonants.charAt(Math.floor(Math.random() * consonants.length));
        syllable += vowels.charAt(Math.floor(Math.random() * vowels.length));
        }

        // Capitalize the first letter of the syllable
        syllable = syllable.charAt(0).toUpperCase() + syllable.slice(1);

        // Add the syllable to the system name
        systemName += syllable;
    }

    // Add a random number between 100 and 999 to the system name
    systemName += numbers.charAt(Math.floor(Math.random() * numbers.length));
    systemName += numbers.charAt(Math.floor(Math.random() * numbers.length));
    systemName += numbers.charAt(Math.floor(Math.random() * numbers.length));

    return systemName;
}