// @ts-ignore
import React, {useEffect, useState} from "react";
import ReactConfetti from "react-confetti";

export const ConfettiCelebration = ({ trigger = false, duration = 5000 }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
        // Set initial dimensions
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });
        
        // Update dimensions on window resize
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        if (trigger) {
            setIsActive(true);
            const timer = setTimeout(() => {
                setIsActive(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [trigger, duration]);
    
    return isActive ? (
            <ReactConfetti
                width={dimensions.width}
        height={dimensions.height}
    numberOfPieces={200}
    recycle={false}
    colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
    />
) : null;
};
