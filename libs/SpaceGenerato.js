import noise, {perlin3D} from './Noise'
import {v4 as uuidv4} from 'uuid';

export default SpaceGenerator;


function SpaceGenerator() {

    const taille_galaxie = 1000;
    const densite = 100;

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
let systems = groupBySystem(galaxy)

// Affichage des positions générées
console.log(systems);
console.log(perlin3D(0.1825, 0.659, 0.55489))
console.log(perlin3D(0.1826, 0.659, 0.55489))
}


function groupBySystem(astres) {
    const systems = [];
    const stars = astres.filter(astre => astre.isStar);
    
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const planets = astres.filter(astre => !astre.isStar && astre.id === star.id);
      systems.push({star, planets});
    }
    
    return systems;
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

/*
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

    if (!isStar && neighborStarCount > 0) {
        const star = neighbors.filter(n => n.isStar)[0]; // prendre la première étoile trouvée
        console.log(star.x, star.y, star.z)
        const dx = star.x - x;
        const dy = star.y - y;
        const dz = star.z - z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const distanceRatio = 0.99; // rapprocher la planète à 1% de la distance
        console.log(x, y, z)
        x += dx * distanceRatio;
        y += dy * distanceRatio;
        z += dz * distanceRatio;
        console.log(x, y, z)
      }
  
    // Création de l'astre
    const astre = {x, y, z, mass, isStar};
    return astre;
  }
*/

/*
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
      const id = uuidv4(); // Créer un identifiant unique pour l'étoile
      const system = [id]; // Créer le système contenant l'étoile
      neighbors.forEach(n => { // Parcourir les voisins
        if (!n.isStar) { // Si le voisin n'est pas une étoile
          if (!n.system) { // Si le voisin n'a pas encore de système
            n.system = system; // Associer le système de l'étoile au voisin
          } else { // Si le voisin a déjà un système
            n.system = n.system.concat(system); // Fusionner les systèmes
            n.system = [...new Set(n.system)]; // Supprimer les doublons
          }
        }
      });
    } else {
      mass = random(seed + x + y + z) * 10;
      if (neighborStarCount > 0) {
        const star = neighbors.filter(n => n.isStar)[0]; // prendre la première étoile trouvée
        const dx = star.x - x;
        const dy = star.y - y;
        const dz = star.z - z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const distanceRatio = 0.99; // rapprocher la planète à 1% de la distance
        x += dx * distanceRatio;
        y += dy * distanceRatio;
        z += dz * distanceRatio;
        if (star.system) { // Si l'étoile a un système
          neighbors.forEach(n => { // Parcourir les voisins
            if (!n.isStar && n.system === undefined) { // Si le voisin est une planète et n'a pas encore de système
              n.system = star.system; // Associer le système de l'étoile à la planète
            }
          });
        }
      }
    }
  
    // Création de l'astre
    const astre = {x, y, z, mass, isStar, system: isStar ? [id] : undefined};
    return astre;
}
*/
/*
function generateAstre(x, y, z, neighbors, systemId) {
    let starProbability = starProbabilityThreshold;
  
    if (neighbors.some(n => n.isStar)) {
      const neighborStarProbability = neighbors.filter(n => n.isStar).length / neighbors.length;
      starProbability = starProbabilityThreshold * (1 - neighborStarProbability);
    }
  
    const isStar = random(seed + x + y + z) < starProbability;
    let mass = isStar ? random(seed + x + y + z) * 1000 : random(seed + x + y + z) * 10;
  
    let system = undefined;
  
    if (isStar) {
      const id = systemId || uuidv4();
      system = { id, planets: [] };
    } else {
      const star = neighbors.find(n => n.system);
      if (star && star.system.id) {
        system = star.system;
        system.planets.push({ x, y, z, mass });
      }
    }
  
    if (!isStar && system) {
      const star = neighbors.find(n => n.isStar && n.system);
      if (star && star.system.id) {
        const dx = star.x - x;
        const dy = star.y - y;
        const dz = star.z - z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const distanceRatio = 0.99;
        x += dx * distanceRatio;
        y += dy * distanceRatio;
        z += dz * distanceRatio;
        systemId = star.system.id;
      }
    }
  
    const astre = { x, y, z, mass, isStar, system };
    if (isStar) {
      astre.system.planets = neighbors.filter(n => !n.isStar && n.systemId === astre.system.id).map(n => ({ x: n.x, y: n.y, z: n.z, mass: n.mass }));
    }
  
    return astre;
  }
*/

function generateAstre(x, y, z, neighbors, systemId) {
    let starProbability = starProbabilityThreshold;
  
    if (neighbors.some(n => n.isStar)) {
      const neighborStarProbability = neighbors.filter(n => n.isStar).length / neighbors.length;
      starProbability = starProbabilityThreshold * (1 - neighborStarProbability);
    }
  
    const isStar = random(seed + x + y + z) < starProbability;
    let mass = isStar ? random(seed + x + y + z) * 1000 : random(seed + x + y + z) * 10;
    let id = undefined;
  
    if (isStar) {
      id = systemId || uuidv4();
    }
  
    let system = undefined;
  
    if (isStar) {
      system = { id, planets: [] };
    } else {
      const star = neighbors.find(n => n.system);
      if (star && star.system.id) {
        system = star.system;
        system.planets.push({ x, y, z, mass });
      }
    }
  
    if (!isStar && system) {
      const star = neighbors.find(n => n.isStar && n.system);
      if (star && star.system.id) {
        const dx = star.x - x;
        const dy = star.y - y;
        const dz = star.z - z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const distanceRatio = 0.99;
        x += dx * distanceRatio;
        y += dy * distanceRatio;
        z += dz * distanceRatio;
        systemId = star.system.id;
      }
    }
  
    const astre = { x, y, z, mass, isStar, id };
    if (isStar) {
      astre.planets = neighbors.filter(n => !n.isStar && n.systemId === astre.id).map(n => ({ x: n.x, y: n.y, z: n.z, mass: n.mass }));
    }
  
    return astre;
  }
