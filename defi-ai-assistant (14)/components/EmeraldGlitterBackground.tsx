import React from 'react';

const PARTICLE_COUNT = 150;

const EmeraldGlitterBackground: React.FC = () => {
    const particles = React.useMemo(() => Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const size = Math.random() * 2.5 + 0.5; // 0.5px to 3px
        const duration = Math.random() * 20 + 15; // 15-35s
        const delay = Math.random() * -35;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const zStart = Math.random() * 1200 - 600; // -600 to 600
        const zEnd = zStart + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 200);

        return {
            id: i,
            style: {
                '--size': `${size}px`,
                '--x': `${x}vw`,
                '--y': `${y}vh`,
                '--z-start': `${zStart}px`,
                '--z-end': `${zEnd}px`,
                '--duration': `${duration}s`,
                '--delay': `${delay}s`,
            } as React.CSSProperties
        };
    }), []);

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-black [perspective:800px]">
                <div className="absolute inset-0 [transform-style:preserve-3d] animate-slow-pan">
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="particle"
                            style={p.style}
                        />
                    ))}
                </div>
            </div>
            <style>{`
                .particle {
                    position: absolute;
                    width: var(--size);
                    height: var(--size);
                    left: var(--x);
                    top: var(--y);
                    border-radius: 50%;
                    background-color: #f4ffb8;
                    box-shadow: 0 0 8px #f4ffb8;
                    animation: float var(--duration) ease-in-out infinite, 
                               twinkle calc(var(--duration) / 2) ease-in-out infinite;
                    animation-delay: var(--delay);
                }
                
                @keyframes float {
                    0% {
                        transform: translateZ(var(--z-start)) translateY(0);
                    }
                    50% {
                        transform: translateZ(var(--z-end)) translateY(-15vh);
                    }
                    100% {
                        transform: translateZ(var(--z-start)) translateY(0);
                    }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.9; }
                }
                
                @keyframes slow-pan {
                    from { transform: rotateY(-8deg) rotateX(4deg); }
                    to { transform: rotateY(8deg) rotateX(4deg); }
                }
                
                .animate-slow-pan {
                    animation: slow-pan 45s linear infinite alternate;
                }
            `}</style>
        </>
    );
};

export default EmeraldGlitterBackground;
