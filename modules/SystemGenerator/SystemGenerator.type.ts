export interface System {
    position: {
        x: number
        y: number
        z: number
    },
    name: string
    normal: {x: number, y: number, z: number}
    nbPlanet: number,
    collection: {
        composition: string
        atmosphere: string
        vegetation: string
        pos: {
            x: number
            y: number
            z: number
        }
    }[]
}