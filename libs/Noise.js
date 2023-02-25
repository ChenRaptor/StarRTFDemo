function noise(x, y, z) {
    // Déclaration des variables entières pour calculer les coordonnées du cube dans la grille de bruit de Perlin
    let xi, yi, zi;
  
    // Conversion des coordonnées en entiers
    xi = Math.floor(x);
    yi = Math.floor(y);
    zi = Math.floor(z);
  
    // Calcul des coordonnées dans le cube
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;
  
    // Calcul des gradients pour les huit coins du cube
    let g000 = grad(xi, yi, zi, xf, yf, zf);
    let g001 = grad(xi, yi, zi+1, xf, yf, zf-1);
    let g010 = grad(xi, yi+1, zi, xf, yf-1, zf);
    let g011 = grad(xi, yi+1, zi+1, xf, yf-1, zf-1);
    let g100 = grad(xi+1, yi, zi, xf-1, yf, zf);
    let g101 = grad(xi+1, yi, zi+1, xf-1, yf, zf-1);
    let g110 = grad(xi+1, yi+1, zi, xf-1, yf-1, zf);
    let g111 = grad(xi+1, yi+1, zi+1, xf-1, yf-1, zf-1);
  
    // Interpolation des gradients pour calculer la valeur de bruit de Perlin
    let u = fade(xf);
    let v = fade(yf);
    let w = fade(zf);
  
    let x1 = lerp(u, dot(g000, [xf, yf, zf]), dot(g100, [xf-1, yf, zf]));
    let x2 = lerp(u, dot(g010, [xf, yf-1, zf]), dot(g110, [xf-1, yf-1, zf]));
    let y1 = lerp(v, x1, x2);
  
    x1 = lerp(u, dot(g001, [xf, yf, zf-1]), dot(g101, [xf-1, yf, zf-1]));
    x2 = lerp(u, dot(g011, [xf, yf-1, zf-1]), dot(g111, [xf-1, yf-1, zf-1]));
    let y2 = lerp(v, x1, x2);
  
    return lerp(w, y1, y2);
  }


  export function perlin3D(x, y, z) {
    // Génération de la grille de bruit de Perlin
    const p = new Array(512);
    for (let i = 0; i < 512; i++) {
      p[i] = Math.floor(Math.random() * 256);
    }
  
    // Calcul des coordonnées dans la grille de bruit de Perlin
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;
  
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);
  
    // Interpolation des vecteurs de gradient aux coins du cube dans lequel se trouve la position (x, y, z)
    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);
  
    const aaa = grad(xi, yi, zi, xf, yf, zf);
    const aba = grad(xi, yi + 1, zi, xf, yf - 1, zf);
    const aab = grad(xi, yi, zi + 1, xf, yf, zf - 1);
    const abb = grad(xi, yi + 1, zi + 1, xf, yf - 1, zf - 1);
    const baa = grad(xi + 1, yi, zi, xf - 1, yf, zf);
    const bba = grad(xi + 1, yi + 1, zi, xf - 1, yf - 1, zf);
    const bab = grad(xi + 1, yi, zi + 1, xf - 1, yf, zf - 1);
    const bbb = grad(xi + 1, yi + 1, zi + 1, xf - 1, yf - 1, zf - 1);
  
    // Interpolation des valeurs de bruit de Perlin dans le cube pour obtenir une valeur unique pour la position (x, y, z)
    const x1 = lerp(u, aaa, baa);
    const x2 = lerp(u, aba, bba);
    const x3 = lerp(u, aab, bab);
    const x4 = lerp(u, abb, bbb);
    const y1 = lerp(v, x1, x2);
    const y2 = lerp(v, x3, x4);
    const z1 = lerp(w, y1, y2);
  
    return z1;
  }
  
  // Fonction pour calculer le produit scalaire entre un gradient et un vecteur
  function dot(grad, vec) {
    return grad[0] * vec[0] + grad[1] * vec[1] + grad[2] * vec[2];
  }
  
  // Fonction pour interpoler entre deux valeurs en utilisant une fonction de transition (fade)
  function lerp(t, a, b) {
    return (1 - t) * a + t * b;
  }
  
  // Fonction de transition (fade) pour une courbe de gradient douce
  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  // Fonction pour récupérer un gradient à partir d'une position donnée dans la grille de bruit de Perlin
  function grad(x, y, z, xf, yf, zf) {
    // Tableau des vecteurs de gradient
    let gradients = [
    [1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
    [1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
    [0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1]
    ];
    
    // Récupération du vecteur de gradient correspondant à la position dans la grille de bruit de Perlin
    let idx = hash(x, y, z) % gradients.length;
    let grad = gradients[idx];
    
    // Calcul du produit scalaire entre le vecteur de gradient et le vecteur allant de la position dans le cube au point (x, y, z)
    return dot(grad, [xf, yf, zf]);
    }
    
    // Fonction de hachage pour obtenir une valeur unique pour chaque entier
    function hash(x, y, z) {
        const p = 16777619;
        const q = 2166136261;
        const n = [x + y * 157 + z * 113];
        let h = q;
      
        n.forEach(char => {
          h += char;
          h *= p;
        });
      
        h += n[0] + n[1] + n[2];
        h ^= h >> 13;
        h *= p;
        h ^= h >> 15;
      
        return h;
      }

export default noise