
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
  onAnimationFinished?: () => void;
  name: string;
}

const loadingTexts = [
    'INITIALIZING ASSETS...',
    'CONNECTING TO GRID...',
    'CALIBRATING PIXELS...',
    'LOADING CREATIVITY MODULES...',
    'DECOMPRESSING IDEAS...',
    'RENDERING NEO-BRUTALIST VIBES...',
    'AWAKENING AI ASSISTANT...',
];

const gridContainerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
};

const squareVariants = {
    hidden: { opacity: 1, scale: 1 },
    visible: (customDelay: number) => ({
        opacity: 0,
        scale: 0,
        transition: {
            duration: 0.3, // Exactly 0.3s as requested
            ease: "easeInOut", // Pleasing, smooth ease
            delay: customDelay // Apply random delay via custom prop
        }
    }),
};

// Helper function to shuffle an array
const shuffleArray = (array: number[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, onAnimationFinished, name }) => {
    const [progress, setProgress] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isContentHidden, setIsContentHidden] = useState(false);
    const [statusText, setStatusText] = useState(loadingTexts[0]);

    // Calculate perfect squares dynamically
    const [gridData, setGridData] = useState({ cols: 0, rows: 0, squareSize: 0 });
    const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

    // Set up the grid dynamically on mount/resize
    useEffect(() => {
        const calculateGrid = () => {
            // Divide the longest side of the screen by 8 to get a chunky square size
            const longestSide = Math.max(window.innerWidth, window.innerHeight);
            const size = Math.ceil(longestSide / 8);

            const newCols = Math.ceil(window.innerWidth / size);
            const newRows = Math.ceil(window.innerHeight / size);

            setGridData({ cols: newCols, rows: newRows, squareSize: size });

            // Recalculate shuffled array for random animation
            const totalSquares = newCols * newRows;
            const indices = Array.from({ length: totalSquares }, (_, i) => i);
            setShuffledIndices(shuffleArray(indices));
        };

        // Initial calculate
        calculateGrid();

        window.addEventListener('resize', calculateGrid);
        return () => window.removeEventListener('resize', calculateGrid);
    }, []);

    // A single, optimized effect to handle all loading screen animations
    useEffect(() => {
        // --- Status Text Cycling ---
        const textInterval = setInterval(() => {
            setStatusText(currentText => {
                const currentIndex = loadingTexts.indexOf(currentText);
                const nextIndex = (currentIndex + 1) % loadingTexts.length;
                return loadingTexts[nextIndex];
            });
        }, 400);

        // --- Progress Bar Animation using requestAnimationFrame for smoothness ---
        let startTime: number | null = null;
        let animationFrameId: number;
        // Faster initial load (1.5s instead of 2.0s)
        const duration = 1500; 

        const animateProgress = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const progressValue = Math.min(100, Math.floor((elapsedTime / duration) * 100));
            
            setProgress(progressValue);

            if (elapsedTime < duration) {
                animationFrameId = requestAnimationFrame(animateProgress);
            } else {
                // Animation finished
                setProgress(100);
                clearInterval(textInterval); // Stop cycling text
                setStatusText('READY.');
                
                // 1. Tell App to render content underneath (opacity 0 -> 1)
                onComplete();

                // 2. Trigger fade out and grid reveal almost simultaneously
                // Small buffer ensures the underlying app has painted
                setTimeout(() => {
                    setIsContentHidden(true); // Fade out text
                    setIsCompleting(true);    // Trigger grid reveal
                }, 100);
            }
        };

        animationFrameId = requestAnimationFrame(animateProgress);

        // Cleanup function to clear timers if the component unmounts
        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(textInterval);
        };
    }, [onComplete]);


    const squaresCount = gridData.cols * gridData.rows;
    const squares = Array.from({ length: squaresCount });

    return (
        <div className={`fixed inset-0 z-[1000] font-sans w-screen h-screen max-w-full max-h-full overflow-hidden ${isCompleting ? 'pointer-events-none bg-transparent' : 'bg-neo-black'}`}>

            {/* Grid Overlay */}
            <motion.div
                className="absolute inset-0 grid"
                style={{
                    gridTemplateColumns: `repeat(${gridData.cols}, ${gridData.squareSize}px)`,
                    gridTemplateRows: `repeat(${gridData.rows}, ${gridData.squareSize}px)`
                }}
                variants={gridContainerVariants}
                initial="hidden"
                animate={isCompleting ? "visible" : "hidden"}
                // Notify parent completely after animation finishes to unmount
                // Using setTimeout based on max staggered duration to ensure we wait for all children.
                onAnimationStart={() => {
                    if (isCompleting && onAnimationFinished) {
                        // Max random rank is totalSquares - 1.
                        // Delay is rank * 0.015, duration is 0.3s.
                        // Add an extra 50ms buffer.
                        const totalSquares = gridData.cols * gridData.rows;
                        const maxDelay = (totalSquares - 1) * 0.015;
                        const totalDuration = (maxDelay + 0.3) * 1000;
                        setTimeout(onAnimationFinished, totalDuration + 50);
                    }
                }}
                id="loading-screen-container"
            >
                {squares.map((_, index) => {
                    // Find the random rank (0 to totalSquares-1) for this specific square
                    const shuffleRank = shuffledIndices.indexOf(index);
                    // Slight increase in delay multiplier because there are fewer total blocks
                    // 0.015s * ~40-64 blocks creates a pleasing ~0.6s to ~0.9s overall stagger
                    const randomDelay = shuffleRank * 0.015;

                    return (
                        <motion.div
                            key={index}
                            className="bg-neo-black w-full h-full"
                            variants={squareVariants}
                            custom={randomDelay}
                        />
                    );
                })}
            </motion.div>

            {/* Content Container - Fades out before grid reveals */}
            <div className={`
                absolute inset-0 flex flex-col justify-between p-4 sm:p-8 text-white
                transition-opacity duration-300 ease-out z-10
                ${isContentHidden ? 'opacity-0' : 'opacity-100'}
            `}>
                {/* Top Label */}
                <div className="text-sm sm:text-xl font-bold tracking-tighter">
                    SYSTEM BOOT // V.2.0
                </div>
                
                {/* Center Progress Display */}
                <div className="flex flex-col items-center w-full">
                    {/* Percentage Text */}
                    <div className="text-[clamp(3.25rem,15vw,9rem)] font-black leading-none">
                        {progress}%
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="w-full max-w-md h-4 bg-gray-900 mt-4 sm:mt-8 border-4 border-white">
                        {/* Actual Filling Bar */}
                        <div 
                            className="h-full bg-white transition-all duration-75 ease-linear" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                
                {/* Bottom Status */}
                <div className="flex justify-between text-[10px] sm:text-sm font-mono w-full uppercase pb-[env(safe-area-inset-bottom,0px)]">
                    <span role="status" aria-live="polite">{statusText}</span>
                    <span>© {new Date().getFullYear()} {name}</span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(LoadingScreen);
