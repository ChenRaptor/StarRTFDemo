import { System } from "../SystemGenerator/SystemGenerator.type"
export interface OptionSpaceGenerationExtended {
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

export interface OptionSpaceGeneration {
    galaxySize: {
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

export interface CubeSector {
    id: string,
    coord: {
        x: number
        y: number
        z: number
    },
    density: number
    hasSystem: boolean
    system: System | null
}

export type Matrice1D = any
export type Matrice2D = Matrice1D[]
export type Matrice3D = Matrice2D[]