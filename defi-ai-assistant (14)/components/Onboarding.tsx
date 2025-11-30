import React, { useState } from 'react';
import { BitcoinIcon, EthereumIcon, SolanaIcon, TetherIcon, ShieldCheckIcon, FingerPrintIcon, LockIcon } from './Icons';

interface OnboardingProps {
  onOnboardingComplete: () => void;
}

// --- Illustration Components ---

const AiChipIllustration = () => {
    // Defines the positions for the chip's pins
    const pins = [
        // Top pins (4)
        ...Array.from({ length: 4 }).map((_, i) => ({ x1: 35 + i * 10, y1: 25, x2: 35 + i * 10, y2: 15 })),
        // Bottom pins (4)
        ...Array.from({ length: 4 }).map((_, i) => ({ x1: 35 + i * 10, y1: 75, x2: 35 + i * 10, y2: 85 })),
        // Left pins (4)
        ...Array.from({ length: 4 }).map((_, i) => ({ x1: 25, y1: 35 + i * 10, x2: 15, y2: 35 + i * 10 })),
        // Right pins (4)
        ...Array.from({ length: 4 }).map((_, i) => ({ x1: 75, y1: 35 + i * 10, x2: 85, y2: 35 + i * 10 })),
    ];

    return (
        <svg viewBox="0 0 100 100" className="w-48 h-48">
            <defs>
                {/* Gradient for the chip body for a subtle 3D effect */}
                <linearGradient id="chipGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f4ffb8" />
                        <stop offset="100%" stopColor="#f4ffb8" />
                </linearGradient>
                {/* Filter for a subtle outer glow */}
                <filter id="chipGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                    <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
                    <feFlood floodColor="#f4ffb8" floodOpacity="0.7" result="flood" />
                    <feComposite in="flood" in2="offsetBlur" operator="in" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Main chip body */}
            <rect 
                x="25" y="25" width="50" height="50" rx="5" 
                fill="url(#chipGradient)" 
                stroke="#f4ffb8" 
                strokeWidth="1" 
                filter="url(#chipGlow)" 
            />
            
            {/* "AI" Text with a slight inner shadow for depth */}
            <text 
                x="50" y="57" 
                fontFamily="Inter, sans-serif" 
                fontSize="24" 
                fontWeight="bold" 
                fill="#f4ffb8" 
                textAnchor="middle"
                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}
            >
                AI
            </text>

            {/* Pins and Terminals group */}
            <g stroke="#f4ffb8" strokeWidth="1.5" strokeLinecap="round">
                {pins.map((p, i) => (
                    <g key={i}>
                        {/* Static pin */}
                        <line {...p} />
                        {/* Terminal circle */}
                        <circle cx={p.x2} cy={p.y2} r="2.5" fill="#f4ffb8" stroke="#f4ffb8" strokeWidth="0.5" />
                        
                        {/* Animated data pulse */}
                        <line 
                            {...p} 
                            stroke="white" 
                            strokeWidth="1.5"
                            strokeDasharray="2 12" // A 2px dash followed by a 12px gap for a sparse pulse
                        >
                            <animate 
                                attributeName="stroke-dashoffset"
                                from="0"
                                to="14" // The sum of dash and gap (2 + 12)
                                dur={`${Math.random() * 2 + 1.5}s`} // Random duration between 1.5s and 3.5s
                                begin={`${Math.random() * 2}s`} // Random start delay
                                repeatCount="indefinite"
                            />
                        </line>
                    </g>
                ))}
            </g>
        </svg>
    );
};


const Slide1Illustration = () => (
  <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
    {/* Grid Background */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(244,255,184,0.2)_100%)]">
      <div className="w-full h-full bg-[linear-gradient(to_right,rgba(5,150,105,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(5,150,105,0.2)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
    </div>
    
    <div className="animate-float-slow">
        <AiChipIllustration />
    </div>

    {/* Floating Coins */}
    <div className="absolute top-[10%] left-[10%] animate-float-slower [transform:translateZ(40px)]">
        <BitcoinIcon className="w-12 h-12 text-yellow-400/80 filter drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]" />
    </div>
    <div className="absolute top-[45%] right-[5%] animate-float [transform:translateZ(60px)]">
        <EthereumIcon className="w-16 h-16 text-sky-400/80 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
    </div>
    <div className="absolute bottom-[10%] left-[20%] animate-float-slow [transform:translateZ(20px)]">
        <TetherIcon className="w-10 h-10 text-[#f4ffb8]/80 filter drop-shadow-[0_0_5px_rgba(244,255,184,0.6)]" />
    </div>

    {/* Chat Bubble */}
    <div className="absolute bottom-[65%] left-[60%] text-white bg-slate-900/50 backdrop-blur-sm p-2 rounded-lg text-sm animate-fade-in-up border border-[#f4ffb8]/50 shadow-lg shadow-black/30" style={{ animationDelay: '0.5s' }}>
        Send 0.05 ETH
    </div>
  </div>
);

const Slide2Illustration = () => {
    // Defines the connection points on the shield
    const connectionPoints = [
        { x: 28, y: 35 }, { x: 22, y: 50 }, { x: 28, y: 65 }, // Left
        { x: 72, y: 35 }, { x: 78, y: 50 }, { x: 72, y: 65 }, // Right
        { x: 50, y: 80 } // Bottom
    ];
    // Defines the circuit paths from the shield
    const circuits = [
        // Left circuits
        { from: connectionPoints[0], to: { x: 10, y: 20 } },
        { from: connectionPoints[1], to: { x: 5, y: 50 } },
        { from: connectionPoints[2], to: { x: 10, y: 80 } },
        // Right circuits
        { from: connectionPoints[3], to: { x: 90, y: 20 } },
        { from: connectionPoints[4], to: { x: 95, y: 50 } },
        { from: connectionPoints[5], to: { x: 90, y: 80 } },
        // Bottom circuit
        { from: connectionPoints[6], to: { x: 50, y: 95 } },
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            <svg viewBox="0 0 100 100" className="w-48 h-48 animate-float-slow">
                <defs>
                    <filter id="securityGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feFlood floodColor="#f4ffb8" floodOpacity="0.8" result="flood" />
                        <feComposite in="flood" in2="blur" operator="in" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Circuits Layer */}
                <g stroke="#f4ffb8" strokeWidth="0.75" filter="url(#securityGlow)">
                    {circuits.map((line, i) => (
                        <g key={i}>
                            <path d={`M ${line.from.x} ${line.from.y} C ${line.from.x} ${line.from.y}, ${(line.from.x + line.to.x)/2} ${line.to.y}, ${line.to.x} ${line.to.y}`} fill="none" />
                            <circle cx={line.to.x} cy={line.to.y} r="2" fill="#f4ffb8" />
                            {/* Animated Pulse */}
                             <circle cx={line.from.x} cy={line.from.y} r="1.5" fill="white">
                                <animateMotion
                                    dur={`${2 + Math.random() * 2}s`}
                                    begin={`${Math.random()}s`}
                                    repeatCount="indefinite"
                                    path={`M 0 0 C 0 0, ${(line.to.x - line.from.x)/2} ${line.to.y - line.from.y}, ${line.to.x - line.from.x} ${line.to.y - line.from.y}`}
                                />
                                <animate attributeName="opacity" values="0;1;1;0" dur={`${2 + Math.random() * 2}s`} begin={`${Math.random()}s`} repeatCount="indefinite" />
                            </circle>
                        </g>
                    ))}
                </g>

                {/* Shield Layer */}
                <g className="animate-shield-pulse" filter="url(#securityGlow)">
                    {/* Shield shape */}
                    <path
                        d="M50 18 L80 30 V60 C80 75, 50 85, 50 85 C50 85, 20 75, 20 60 V30 Z"
                        fill="rgba(5, 150, 105, 0.2)"
                        stroke="#f4ffb8"
                        strokeWidth="1.5"
                    />
                     {/* Inner dashed line for detail */}
                    <path
                        d="M50 22 L75 33 V58 C75 70, 50 78, 50 78 C50 78, 25 70, 25 58 V33 Z"
                        fill="none"
                        stroke="#f4ffb8"
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                    />
                </g>

                {/* Padlock Layer */}
                <g transform="translate(0, 2)" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="38" y="45" width="24" height="18" rx="2" fill="#f4ffb8" stroke="#f4ffb8" strokeWidth="1" />
                    <path d="M 62 45 V 38 a 12 12 0 0 0 -24 0 V 45" stroke="#a7f3d0" strokeWidth="2" fill="none" />
                    <circle cx="50" cy="54" r="2" fill="#f4ffb8" className="animate-keyhole-glow" />
                </g>
            </svg>
        </div>
    );
};

const Slide3Illustration = () => {
    // A slightly more organic, hexagonal layout inspired by the reference image
    const tokens = [
        { id: 'btc', x: 22, y: 35, size: 22 },   // Top Left
        { id: 'eth', x: 50, y: 20, size: 22 },   // Top Middle
        { id: 'link', x: 78, y: 35, size: 20 },  // Top Right
        { id: 'uni', x: 22, y: 65, size: 20 },   // Bottom Left
        { id: 'comp', x: 50, y: 80, size: 20 },  // Bottom Middle
        { id: 'usdt', x: 78, y: 65, size: 20 },  // Bottom Right
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            <svg viewBox="0 0 100 100" className="w-64 h-64">
                <defs>
                    {/* Gradients to match the reference image */}
                    <radialGradient id="btcGradient" cx="25%" cy="25%" r="75%"><stop offset="0%" stopColor="#FBB348"/><stop offset="100%" stopColor="#F7931A"/></radialGradient>
                    <radialGradient id="ethGradient" cx="25%" cy="25%" r="75%"><stop offset="0%" stopColor="#8A92B2"/><stop offset="100%" stopColor="#627EEA"/></radialGradient>
                    <radialGradient id="linkGradient" cx="25%" cy="25%" r="75%"><stop offset="0%" stopColor="#6586F9"/><stop offset="100%" stopColor="#2A5ADA"/></radialGradient>
                    <radialGradient id="uniGradient" cx="25%" cy="25%" r="75%"><stop offset="0%" stopColor="#FF71C5"/><stop offset="100%" stopColor="#FF007A"/></radialGradient>
                    <radialGradient id="compGradient" cx="25%" cy="25%" r="75%"><stop offset="0%" stopColor="#2DCF9E"/><stop offset="100%" stopColor="#00D395"/></radialGradient>
                    <radialGradient id="usdtGradient" cx="25%" cy="25%" r="75%"><stop offset="0%" stopColor="#8e83b1"/><stop offset="100%" stopColor="#67489c"/></radialGradient>

                    {/* Filter for the soft shadow to give a lifted effect */}
                    <filter id="coinGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
                    </filter>
                    <filter id="multiChainGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feFlood floodColor="#f4ffb8" floodOpacity="1" result="flood" />
                        <feComposite in="flood" in2="blur" operator="in" result="glow" />
                        <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Central Core */}
                <g>
                    <circle cx="50" cy="50" r="8" fill="rgba(244,255,184,0.2)" stroke="#f4ffb8" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="4" fill="#f4ffb8" className="animate-pulse-core" />
                </g>

                {/* Connecting Lines */}
                <g stroke="#f4ffb8" strokeWidth="0.5" strokeLinecap="round">
                    {tokens.map((token, i) => (
                        <g key={`line-${i}`}>
                            <line
                                x1="50" y1="50" x2={token.x} y2={token.y}
                                strokeDasharray="100"
                                className="animate-draw-connector"
                                style={{ animationDelay: `${0.2 * i}s` }}
                            />
                            <circle r="1" fill="white" filter="url(#multiChainGlow)">
                                <animateMotion
                                    dur="3s"
                                    begin={`${0.5 + 0.2 * i}s`}
                                    repeatCount="indefinite"
                                    path={`M50,50 L${token.x},${token.y}`}
                                />
                            </circle>
                        </g>
                    ))}
                </g>

                {/* Crypto Tokens */}
                {tokens.map(({ id, x, y, size }, i) => (
                    <g key={id} className="animate-float" style={{ animationName: i % 2 === 0 ? 'float-slower' : 'float', animationDelay: `${i * 0.4}s` }}>
                        <g transform={`translate(${x}, ${y})`} filter="url(#coinGlow)">
                            <circle cx="0" cy="0" r={size / 2} fill={`url(#${id}Gradient)`} />
                            <g transform={`scale(${size / 32}) translate(-16, -16)`} fill="white">
                                {id === 'btc' && <path d="M15.5 17.5v-3.7h2.7c1.4 0 2.3.7 2.3 1.8c0 1.1-.9 1.9-2.3 1.9h-2.7zm0-5.3V8.5h2.5c1.5 0 2.3.8 2.3 1.9c0 1.1-.8 1.8-2.3 1.8h-2.5zm-2.5-5.2h6c2.2 0 3.8 1.5 3.8 3.4c0 1.4-.8 2.6-2 3.2v.1c1.4.5 2.3 1.6 2.3 3.1c0 2.1-1.7 3.6-4.1 3.6h-5.5V7z" />}
                                {id === 'eth' && <path d="M16 3 L7 12.92 L16 17.22 L25 12.92 L16 3 Z M16 24.6 L7 15.68 L16 20 L25 15.68 L16 24.6 Z" />}
                                {id === 'link' && <path d="M16 11.4 20.8 8.7 25.6 11.4 20.8 14.1 16 11.4ZM10.8 12.6 6 15.3v5.4l4.8-2.7v-5.4ZM6 9.3l4.8-2.7v5.4L6 15.3V9.3ZM16 19.5v5.4l4.8-2.7v-5.4L16 19.5Z" />}
                                {id === 'uni' && <path d="M23.3,10.5C21.2,9.1,18,9.4,18,9.4c-2.3,0-4.3,1-5.7,2.5c-2.5,2.6-3.2,6.4-2.1,9.4c0,0,1.2,2.4,3.9,2.4s3.9-2.4,3.9-2.4c-1-2.4-0.1-4.5,0.7-5.5c2.3-2.6,5.3-2.1,5.3-2.1S25.4,11.9,23.3,10.5z M13,10.6c0-1.8,1-3.3,2.4-4.1c0.3-0.2,0.3-0.6,0-0.8c-0.3-0.2-0.6-0.1-0.8,0.1C12.8,7,11.5,8.8,11.5,10.8c0,0.3,0.3,0.6,0.6,0.6S13,10.9,13,10.6z"/>}
                                {id === 'comp' && <path d="M11 20H21V17H11V20ZM13 15H23V12H13V15ZM15 10H25V7H15V10Z" />}
                                {id === 'usdt' && <path d="M16.5,10.5h-5.2l2.6-4.5l2.6,4.5z M19,13h5.2l-2.6,4.5L19,13z M14,13H8.8l2.6,4.5L14,13z M16.5,22.5l2.6-4.5h-5.2L16.5,22.5z" />}
                            </g>
                        </g>
                    </g>
                ))}
            </svg>
        </div>
    );
};


const slides = [
  {
    illustration: <Slide1Illustration />,
    title: 'AI-Powered Control',
    subtitle: 'Manage crypto with simple voice or text commands.',
  },
  {
    illustration: <Slide2Illustration />,
    title: 'Military-Grade Security',
    subtitle: 'Biometric + AI double confirmation.',
  },
  {
    illustration: <Slide3Illustration />,
    title: 'Multi-Chain Freedom',
    subtitle: 'One wallet, infinite possibilities.',
  },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onOnboardingComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onOnboardingComplete();
    }
  };

  const handleSkip = () => {
    onOnboardingComplete();
  };
  
  const slide = slides[currentSlide];

  return (
    <div className="w-full h-screen bg-black flex flex-col justify-between items-center p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#f4ffb8] via-black to-black opacity-80"></div>
        </div>

        <div className="w-full flex justify-end z-10">
            <button onClick={handleSkip} className="text-gray-400 hover:text-white transition-colors font-semibold">
            Skip
            </button>
        </div>

        <div className="flex flex-col items-center text-center z-10 w-full">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8 bg-slate-800/20 backdrop-blur-md border border-[#f4ffb8]/30 rounded-2xl shadow-2xl shadow-[#f4ffb8]/50 overflow-hidden">
                {slide.illustration}
            </div>
            
            <h1 key={`${currentSlide}-title`} className="text-3xl font-bold mb-3 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                {slide.title}
            </h1>
            <p key={`${currentSlide}-subtitle`} className="text-gray-300 max-w-xs animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                {slide.subtitle}
            </p>
        </div>

        <div className="w-full flex flex-col items-center z-10">
            <div className="flex gap-2 mb-6">
            {slides.map((_, index) => (
                <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index ? 'bg-[#f4ffb8] scale-125' : 'bg-gray-600'
                    }`}
                />
            ))}
            </div>
            <button
                onClick={handleNext}
                className="w-full max-w-xs bg-[#f4ffb8] text-black font-semibold py-3 px-6 rounded-lg shadow-lg shadow-[#f4ffb8]/50 hover:bg-[#f4ffb8] transition-all duration-300 transform hover:scale-105 active:scale-100"
            >
                {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </button>
        </div>
        <style>{`
            @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-10px) translateX(5px); } }
            @keyframes float-slow { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-8px) translateX(-3px); } }
            @keyframes float-slower { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(5px) translateX(2px); } }
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
            .animate-float-slower { animation: float-slower 7s ease-in-out infinite; }

            @keyframes pulse-slow { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            .animate-pulse-slow { animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

            @keyframes pulse-core {
                0%, 100% { transform: scale(1); box-shadow: 0 0 10px 2px #d1fae5; }
                50% { transform: scale(1.2); box-shadow: 0 0 20px 5px #d1fae5; }
            }
            .animate-pulse-core { 
                animation: pulse-core 2.5s ease-in-out infinite; 
                transform-origin: center;
            }
            
            @keyframes draw-connector-anim {
                from { stroke-dashoffset: 100; opacity: 0; }
                to { stroke-dashoffset: 0; opacity: 1; }
            }
            .animate-draw-connector {
                animation: draw-connector-anim 1s ease-out forwards;
                opacity: 0;
            }

            @keyframes shield-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            .animate-shield-pulse {
                animation: shield-pulse 3s ease-in-out infinite;
                transform-origin: center;
            }
            
            @keyframes keyhole-glow {
                0%, 100% { box-shadow: 0 0 3px 1px #d1fae5; }
                50% { box-shadow: 0 0 8px 3px #d1fae5; }
            }
            .animate-keyhole-glow {
                animation: keyhole-glow 2.5s ease-in-out infinite;
            }
        `}</style>
    </div>
  );
};
