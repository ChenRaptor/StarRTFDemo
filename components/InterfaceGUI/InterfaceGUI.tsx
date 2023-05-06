import { OptionGenerationContext } from '@/context/OptionGeneration';
import { useContext, useEffect, useState } from 'react';
import style from './InterfaceGUI.module.css'

export default function InterfaceGUI () {

    const optionGenerationContextValue = useContext(OptionGenerationContext);
    let { position, galaxySize } = optionGenerationContextValue;

    const [isOpen, setIsOpen] = useState(false)
    

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'i') {
                setIsOpen(prevOpen => !prevOpen);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);



    return (
        <div className={`${style.InterfaceGUI} ${isOpen ? style['open'] : ''}`}>
            <span>Position: [{position.x},{position.y},{position.z}]</span>
            <span>GalaxySize: [{galaxySize.x},{galaxySize.y},{galaxySize.z}]</span>
            <button>zdzd</button>
        </div>
    )
}