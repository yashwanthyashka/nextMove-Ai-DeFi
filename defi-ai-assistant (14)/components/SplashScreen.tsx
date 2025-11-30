
import React from 'react';

// --- New Components for AI Chip Network ---

const AiChipIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg viewBox="0 0 100 100" className={className} style={style}>
        <defs>
            <linearGradient id="chipFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#222" />
                <stop offset="100%" stopColor="#000" />
            </linearGradient>
            <linearGradient id="scanlineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="45%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="0.2" />
                <stop offset="55%" stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
                <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="0 -1"
                    to="0 2"
                    dur="2.5s"
                    repeatCount="indefinite"
                />
            </linearGradient>
             <filter id="chipGlowEffect" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#chipGlowEffect)">
            {/* Main chip shape using a path for a more techy look */}
            <path d="M 20 10 L 80 10 L 90 20 L 90 80 L 80 90 L 20 90 L 10 80 L 10 20 Z" fill="#111" stroke="#f4ffb8" strokeWidth="1" />
            {/* Inner details */}
            <path d="M 25 20 L 75 20 L 80 25 L 80 75 L 75 80 L 25 80 L 20 75 L 20 25 Z" fill="none" stroke="#f4ffb8" strokeOpacity="0.3" strokeWidth="0.5" />
            {/* Core with scanline */}
            <rect x="30" y="30" width="40" height="40" rx="4" fill="url(#chipFill)" stroke="#f4ffb8" strokeWidth="1" />
            <rect x="30" y="30" width="40" height="40" rx="4" fill="url(#scanlineGradient)" />
            {/* Text 'AI' */}
            <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#f4ffb8" letterSpacing="-1">
                AI
            </text>
        </g>
    </svg>
);

const NodeChipIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
     <svg viewBox="0 0 60 60" className={className} style={style} filter="url(#chipGlowEffect)">
        <rect x="10" y="10" width="40" height="40" rx="6" fill="#111" stroke="#f4ffb8" strokeWidth="1" />
        <rect x="15" y="15" width="30" height="30" rx="4" fill="#222" stroke="#f4ffb8" strokeWidth="1" />
    </svg>
);


// --- Configuration ---
const CHIP_NETWORK = [
    // Center Chip
    { id: 'center', Icon: AiChipIcon, size: 'w-24 h-24', style: { top: '50%', left: '50%' }, delay: '1.0s' },
    // Surrounding Node Chips
    { id: 'tl', Icon: NodeChipIcon, size: 'w-12 h-12', style: { top: '20%', left: '20%' }, delay: '1.2s' },
    { id: 'tr', Icon: NodeChipIcon, size: 'w-12 h-12', style: { top: '20%', left: '80%' }, delay: '1.3s' },
    { id: 'bl', Icon: NodeChipIcon, size: 'w-12 h-12', style: { top: '80%', left: '20%' }, delay: '1.4s' },
    { id: 'br', Icon: NodeChipIcon, size: 'w-12 h-12', style: { top: '80%', left: '80%' }, delay: '1.5s' },
];

const CIRCUIT_PATHS = [
    { d: "M 42 42 Q 30 30 23 23", delay: '1.8s', dur: '1.2s' },
    { d: "M 58 42 Q 70 30 77 23", delay: '1.9s', dur: '1.2s' },
    { d: "M 42 58 Q 30 70 23 77", delay: '2.0s', dur: '1.2s' },
    { d: "M 58 58 Q 70 70 77 77", delay: '2.1s', dur: '1.2s' },
];

export const SplashScreen: React.FC = () => {
    return (
        <div className="w-full h-screen bg-black flex justify-center items-center overflow-hidden [perspective:1000px]">
            {/* STAGE 1: BACKGROUND */}
            <div className="absolute inset-0 z-0 [transform-style:preserve-3d]">
                <div 
                    className="absolute inset-0 animate-grid-pan"
                    style={{
                        backgroundSize: '4rem 4rem',
                        backgroundImage: `
                            linear-gradient(to right, rgba(244, 255, 184, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(244, 255, 184, 0.15) 1px, transparent 1px)
                        `,
                        maskImage: 'radial-gradient(ellipse at center, white 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* STAGE 2: GLASS PANEL & AI NETWORK */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 [transform-style:preserve-3d] animate-panel-appear">
                 {/* Glassmorphic Panel */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10" />

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-[-200%] animate-border-spin [background:conic-gradient(from_90deg_at_50%_50%,#0000_0%,#f4ffb8_50%,#0000_100%)]" />
                </div>
                
                {/* Network Container */}
                <div className="relative w-full h-full">
                    {/* Chips (Nodes) */}
                    {CHIP_NETWORK.map(({ id, Icon, size, style, delay }) => (
                        <div key={id} className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
                            <Icon className={`${size} animate-node-appear`} style={{ animationDelay: delay }} />
                        </div>
                    ))}

                    {/* Connecting Lines & Data Pulses */}
                    <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full overflow-visible">
                        {CIRCUIT_PATHS.map(({ d, delay, dur }, i) => (
                            <g key={i}>
                                    <path
                                    d={d}
                                    fill="none"
                                    stroke="rgba(244, 255, 184, 0.5)"
                                    strokeWidth="0.5"
                                    className="animate-draw-lines"
                                    style={{ animationDelay: delay, animationDuration: dur }}
                                />
                                {/* Data Pulse */}
                                <circle r="1" fill="#f4ffb8" style={{ filter: 'drop-shadow(0 0 4px #f4ffb8)' }}>
                                    <animateMotion dur="1.5s" begin={delay} repeatCount="indefinite" path={d} />
                                </circle>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* STAGE 3: UI APPEAR */}
            <div className="absolute inset-0 flex flex-col items-center justify-center animate-ui-appear opacity-0 pointer-events-none">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white tracking-wider mb-2" style={{ textShadow: '0 0 15px rgba(213, 250, 211, 0.8), 0 0 5px rgba(255, 255, 255, 0.5)' }}>
                        nextMove
                    </h1>
                    <p className="text-lg text-[#f4ffb8]" style={{ textShadow: '0 0 8px rgba(244,255,184,0.6)' }}>
                        Empowering your AI-driven future
                    </p>
                </div>
            </div>

            <style>{`
                /* --- STAGE CONTROLLERS (Total Duration: 4.5s) --- */
                @keyframes panel-appear-anim {
                    0% { transform: scale(0.8) rotateX(45deg) translateZ(100px); opacity: 0; }
                    22% { transform: scale(0.8) rotateX(45deg) translateZ(100px); opacity: 0; } /* Hold */
                    55% { transform: scale(1) rotateX(0deg) translateZ(0); opacity: 1; }
                    73%, 100% { transform: scale(1) rotateX(0deg) translateZ(0); opacity: 1; }
                }
                .animate-panel-appear { animation: panel-appear-anim 4.5s ease-out forwards; }

                @keyframes ui-appear-anim {
                    0%, 73% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-ui-appear { animation: ui-appear-anim 4.5s forwards; }

                /* --- Stage 1 Animations --- */
                @keyframes grid-pan-anim {
                    from { transform: translateZ(-200px) rotateX(75deg) translateY(40%); background-position: 0 0; }
                    to { transform: translateZ(-200px) rotateX(75deg) translateY(40%); background-position: 4rem 4rem; }
                }
                .animate-grid-pan { animation: grid-pan-anim 5s linear infinite; }

                /* --- Stage 2 Animations --- */
                @keyframes border-spin-anim {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-border-spin { animation: border-spin-anim 4s linear infinite; }

                @keyframes node-appear-anim {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-node-appear { animation: node-appear-anim 0.6s ease-out forwards; }
                
                @keyframes draw-lines-anim {
                    from { stroke-dashoffset: 100; }
                    to { stroke-dashoffset: 0; }
                }
                .animate-draw-lines {
                    stroke-dasharray: 100;
                    animation: draw-lines-anim ease-out forwards;
                }
            `}</style>
        </div>
    );
};
