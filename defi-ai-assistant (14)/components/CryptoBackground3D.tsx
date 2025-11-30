import React from 'react';
import { 
    BitcoinIcon, 
    EthereumIcon, 
    SolanaIcon, 
    TetherIcon,
    USDCIcon,
    XRPIcon
} from './Icons';

const COIN_TYPES = [
    { Icon: BitcoinIcon, color: 'text-yellow-500/50' },
    { Icon: EthereumIcon, color: 'text-sky-400/50' },
    { Icon: SolanaIcon, color: 'text-fuchsia-500/50' },
    { Icon: TetherIcon, color: 'text-emerald-400/50' },
    { Icon: USDCIcon, color: 'text-blue-500/50' },
    { Icon: XRPIcon, color: 'text-gray-400/50' },
];

const COINS_TO_RENDER = Array.from({ length: 35 }).map((_, i) => {
    const type = COIN_TYPES[i % COIN_TYPES.length];
    const size = Math.random() * 40 + 20; // size between 20px and 60px
    const duration = Math.random() * 20 + 15; // 15-35s
    const delay = Math.random() * -35;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const zStart = Math.random() * 1200 - 600; // -600 to 600
    const zEnd = zStart + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 300 + 100);
    const rotationStart = Math.random() * 360;
    const rotationEnd = rotationStart + (Math.random() > 0.5 ? 1 : -1) * 720;
    const xDrift = (Math.random() - 0.5) * 10;
    const yDrift = (Math.random() - 0.5) * 10;


    return {
        id: i,
        Icon: type.Icon,
        color: type.color,
        style: {
            '--size': `${size}px`,
            '--x': `${x}vw`,
            '--y': `${y}vh`,
            '--z-start': `${zStart}px`,
            '--z-end': `${zEnd}px`,
            '--rot-start': `${rotationStart}deg`,
            '--rot-end': `${rotationEnd}deg`,
            '--x-drift': `${xDrift}vw`,
            '--y-drift': `${yDrift}vh`,
            '--duration': `${duration}s`,
            '--delay': `${delay}s`,
        } as React.CSSProperties
    };
});


const CryptoBackground3D: React.FC = () => {
    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-black [perspective:800px]">
                <div className="absolute inset-0 [transform-style:preserve-3d] animate-slow-pan">
                    {COINS_TO_RENDER.map(p => (
                        <div
                            key={p.id}
                            className="coin"
                            style={p.style}
                        >
                            <p.Icon className={`${p.color} w-full h-full`} />
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .coin {
                    position: absolute;
                    width: var(--size);
                    height: var(--size);
                    left: var(--x);
                    top: var(--y);
                    will-change: transform;
                    animation: float3d var(--duration) ease-in-out infinite;
                    animation-delay: var(--delay);
                }
                
                .animate-slow-pan::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    --x: 50%;
                    --y: 50%;
                    --light-color: hsla(158, 82%, 57%, 0.15);
                    background: radial-gradient(
                        circle 800px at var(--x) var(--y),
                        var(--light-color),
                        transparent 50%
                    );
                    will-change: background;
                    animation: ambient-light 25s ease-in-out infinite alternate;
                    mix-blend-mode: soft-light;
                }

                @keyframes ambient-light {
                    0% {
                        --x: 20%;
                        --y: 30%;
                        --light-color: hsla(158, 82%, 57%, 0.15); /* Emerald */
                    }
                    50% {
                        --x: 80%;
                        --y: 70%;
                        --light-color: hsla(220, 82%, 65%, 0.12); /* Blue */
                    }
                    100% {
                        --x: 40%;
                        --y: 40%;
                        --light-color: hsla(260, 82%, 70%, 0.15); /* Purple */
                    }
                }

                @keyframes float3d {
                    0% {
                        transform: translateZ(var(--z-start)) rotateY(var(--rot-start)) translateX(0) translateY(0);
                        opacity: 0.8;
                    }
                    50% {
                        transform: translateZ(var(--z-end)) rotateY(calc(var(--rot-start) + var(--rot-end) / 2)) translateX(var(--x-drift)) translateY(var(--y-drift));
                        opacity: 1;
                    }
                    100% {
                        transform: translateZ(var(--z-start)) rotateY(var(--rot-end)) translateX(0) translateY(0);
                        opacity: 0.8;
                    }
                }
                
                @keyframes slow-pan {
                    from { transform: rotateY(-8deg) rotateX(4deg) scale(1.2); }
                    to { transform: rotateY(8deg) rotateX(4deg) scale(1.2); }
                }
                
                .animate-slow-pan {
                    animation: slow-pan 45s linear infinite alternate;
                }
            `}</style>
        </>
    );
};

export default CryptoBackground3D;
