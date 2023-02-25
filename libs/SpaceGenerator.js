import noise, {perlin3D} from './Noise'

function goat() {
// Définition des paramètres de la galaxie et de la zone de génération
const taille_galaxie = 1000; // Taille de la galaxie
const densite = 100; // Densité des étoiles et des planètes

// Génération des positions des étoiles et des planètes
let galaxy = [];
for(let i = 0; i < densite; i++) {
  // Génération d'un bruit de Perlin en 3D pour la position
  let x = perlin3D(Math.random(), Math.random(), Math.random());
  let y = perlin3D(Math.random(), Math.random(), Math.random());
  let z = perlin3D(Math.random(), Math.random(), Math.random());
  
  // Normalisation des valeurs du bruit de Perlin pour les positions
  x = x * taille_galaxie;
  y = y * taille_galaxie;
  z = z * taille_galaxie;

  const astre = generateAstre(x, y, z, galaxy);

  // Ajout des positions générées dans le tableau de positions
  galaxy.push(astre);
}

// Affichage des positions générées
console.log(galaxy);
console.log(perlin3D(0.1825, 0.659, 0.55489))
console.log(perlin3D(0.1826, 0.659, 0.55489))
}




// Définition de la graine de génération de nombres aléatoires pour obtenir une cohérence entre les masses générées
const seed = 12345;

// Fonction de génération de nombres aléatoires en utilisant la graine définie
function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Génération d'une étoile avec une position et une masse pseudo-aléatoire cohérente
function generateStar(x, y, z) {
  const mass = random(seed + x + y + z) * 1000;
  const star = {x, y, z, mass};
  return star;
}

// Génération d'une planète avec une position et une masse pseudo-aléatoire cohérente
function generatePlanet(x, y, z) {
  const mass = random(seed + x + y + z) * 10;
  const planet = {x, y, z, mass};
  return planet;
}


const starProbabilityThreshold = 0.8;

function generateAstre(x, y, z, neighbors) {
    // Calcul de la probabilité qu'un astre soit une étoile en fonction des astres voisins
    const neighborStarCount = neighbors.filter(n => n.isStar).length;
    let starProbability = starProbabilityThreshold;
    if (neighborStarCount > 0) {
      const neighborStarProbability = neighborStarCount / neighbors.length;
      starProbability = starProbabilityThreshold * (1 - neighborStarProbability);
    }
  
    // Génération d'un nombre aléatoire pour déterminer si l'astre est une étoile ou une planète
    const rand = random(seed + x + y + z);
    const isStar = rand < starProbability;
  
    // Génération d'une masse pseudo-aléatoire en fonction du type d'astre
    let mass;
    if (isStar) {
      mass = random(seed + x + y + z) * 1000;
    } else {
      mass = random(seed + x + y + z) * 10;
    }
  
    // Création de l'astre
    const astre = {x, y, z, mass, isStar};
    return astre;
  }


export default goat;