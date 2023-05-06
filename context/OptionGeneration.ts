import { createContext } from "react";


// Type 
export interface OptionGeneration {
    galaxySize: {
        x: number, 
        y: number, 
        z: number
    },
    position: {
        x: number,
        y: number, 
        z: number
    }
}



// Default
const defaultOptionGeneration : OptionGeneration = {
    galaxySize: {
        x: 20, 
        y: 20, 
        z: 5
    },
    position: {
        x: 0, 
        y: 0, 
        z: 0
    }
}

export const OptionGenerationContext = createContext<OptionGeneration>(defaultOptionGeneration)