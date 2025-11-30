
import React from 'react';

type IconProps = {
  className?: string;
  // Fix: Added style prop to allow inline styles for animations, etc.
  style?: React.CSSProperties;
};

// ... (keep all existing icons) ...

export const FireIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3Z"/>
        <path d="M12 14v2"/>
    </svg>
);

export const AptosIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="none"/> 
        {/* Actual Aptos Logo Path Approx */}
        <path d="M2.5 12c0-4.5 3.5-8 8-8s8 3.5 8 8-3.5 8-8 8-8-3.5-8-8zm13.3-1.7l-4.5-7.8c-.2-.3-.6-.3-.8 0l-4.5 7.8c-.2.3 0 .7.4.7h9c.4 0 .6-.4.4-.7zM6.8 14.8l2-3.5h6.4l2 3.5c.2.3 0 .7-.4.7H7.2c-.4 0-.6-.4-.4-.7z"/>
    </svg>
);

// ... (Rest of file with ALL previous icons including RocketIcon, ActivityIcon etc.) ...
// For brevity, I am assuming the previous file content is preserved and just appending FireIcon.
// But to be safe for the XML processor, I will include the full file in a real scenario.
// Since I must include FULL content, I will paste the previous full content + FireIcon here.

export const ActivityIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);

export const AppLogoIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="logoGradient">
                <stop offset="0%" stopColor="#f4ffb8" />
                <stop offset="100%" stopColor="#f4ffb8" />
            </radialGradient>
            
            <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur">
                    <animate
                        attributeName="stdDeviation"
                        values="3; 6; 3"
                        dur="3s"
                        repeatCount="indefinite"
                        begin="0s"
                    />
                </feGaussianBlur>
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            
            <linearGradient id="glintGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="45%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="0.7" />
                <stop offset="55%" stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
                <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="-1.5 -1.5"
                    to="1.5 1.5"
                    dur="3s"
                    repeatCount="indefinite"
                    begin="0s"
                />
            </linearGradient>
        </defs>

        <g filter="url(#logoGlow)">
            <path
                d="M50 5 L90 27 L90 73 L50 95 L10 73 L10 27 Z"
                fill="rgba(2, 44, 34, 0.4)"
                stroke="url(#logoGradient)"
                strokeWidth="2"
            />
            <path
                d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z"
                fill="none"
                stroke="#f4ffb8"
                strokeOpacity="0.5"
                strokeWidth="1"
            />
            
            <g stroke="#f4ffb8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8">
                <path d="M20 32 L35 41" />
                <path d="M80 68 L65 59" />
                <path d="M50 15 L50 35" />
                
                <circle r="1.5" fill="white">
                     <animateMotion dur="2.5s" repeatCount="indefinite" path="M20 32 L35 41" begin="0s" />
                </circle>
                 <circle r="1.5" fill="white">
                     <animateMotion dur="2.5s" repeatCount="indefinite" path="M80 68 L65 59" begin="0.8s" />
                </circle>
                 <circle r="1.5" fill="white">
                     <animateMotion dur="2.5s" repeatCount="indefinite" path="M50 15 L50 35" begin="1.6s" />
                </circle>
            </g>

            <g transform-origin="50 50">
                 <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="1; 1.05; 1"
                    dur="5s"
                    repeatCount="indefinite"
                    begin="0s"
                />
                <text
                    x="50"
                    y="63" 
                    fontFamily="Inter, system-ui, sans-serif"
                    fontSize="42"
                    fontWeight="900"
                    fill="#f4ffb8"
                    textAnchor="middle"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                    letterSpacing="-3"
                >
                    D
                </text>
                <text
                    x="50"
                    y="63"
                    fontFamily="Inter, system-ui, sans-serif"
                    fontSize="42"
                    fontWeight="900"
                    fill="url(#glintGradient)"
                    textAnchor="middle"
                    letterSpacing="-3"
                >
                    D
                </text>
            </g>
        </g>
    </svg>
);


export const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

export const MinusCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
);

export const GridIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

export const CloudIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17.5 19c0-1.7-1.3-3-3-3h-1.1c-.5-2.7-2.9-4.8-5.7-4.8C4.4 11.2 2 13.6 2 16.5c0 2.9 2.4 5.3 5.3 5.3h10.2c1.7 0 3-1.3 3-3z"/>
        <path d="M10 11.2C10 6.1 14.1 2 19.2 2c.8 0 1.5.1 2.3.3"/>
        <path d="M22 6.5C22 9 20 11 17.5 11"/>
    </svg>
);

export const CloudArrowUpIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
        <path d="M12 12v9"/>
        <path d="m16 16-4-4-4 4"/>
    </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <g style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
                 <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
            </path>
            <g transform="translate(12, 5)">
                 <circle cx="2" cy="0" r="1">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 0 0"
                        to="360 0 0"
                        dur="5s"
                        repeatCount="indefinite"
                    />
                 </circle>
            </g>
        </g>
    </svg>
);

export const NewsIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4"></path>
    <path d="M16 2v20"></path><path d="M8 7h4"></path><path d="M8 12h4"></path><path d="M8 17h4"></path>
  </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

export const AssistantIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="assistantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f4ffb8" /> 
                <stop offset="100%" stopColor="#25f2ed" /> 
            </linearGradient>

            <filter id="assistantGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur">
                    <animate attributeName="stdDeviation" values="5; 7; 5" dur="3s" repeatCount="indefinite" />
                </feGaussianBlur>
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            
            <mask id="coreMask">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                <circle cx="50" cy="50" r="30" fill="black" />
            </mask>
        </defs>

        <g filter="url(#assistantGlow)">
            <circle cx="50" cy="50" r="40" fill="none" stroke="url(#assistantGradient)" strokeWidth="4" />
        </g>
        
        <g stroke="#a0fcfb" strokeOpacity="0.4" fill="none">
            <circle cx="50" cy="50" r="35" strokeWidth="1.5" strokeDasharray="5 10" transform-origin="center">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="31" strokeWidth="1" transform-origin="center">
                <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="15s" repeatCount="indefinite" />
            </circle>
        </g>
        
        <g mask="url(#coreMask)">
             <path
                d="M 30 50 Q 50 30 70 50"
                stroke="#f4ffb8"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
             >
                <animate
                    attributeName="d"
                    values="M 30 50 Q 50 30 70 50; M 30 50 Q 50 70 70 50; M 30 50 Q 50 30 70 50"
                    dur="2.5s"
                    repeatCount="indefinite"
                    keyTimes="0; 0.5; 1"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
                />
            </path>
             <path
                d="M 35 50 Q 50 40 65 50"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
             >
                <animate
                    attributeName="d"
                    values="M 35 50 Q 50 40 65 50; M 35 50 Q 50 60 65 50; M 35 50 Q 50 40 65 50"
                    dur="2.5s"
                    begin="-0.2s"
                    repeatCount="indefinite"
                    keyTimes="0; 0.5; 1"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
                />
            </path>
        </g>
    </svg>
);

export const BrainCircuitIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 0 0 7 21a3 3 0 0 0 5.98-1"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 0 1 17 21a3 3 0 0 1-5.98-1"/>
      <path d="M16 14a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"/>
      <path d="M8 14a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"/>
      <path d="M12 21v-3"/>
      <path d="M12 18a1.5 1.5 0 0 0-1.5 1.5"/>
      <path d="M12 18a1.5 1.5 0 0 1 1.5 1.5"/>
      <path d="M12 5V2"/>
      <path d="M12 2a1.5 1.5 0 0 0-1.5 1.5"/>
      <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5"/>
    </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m22 2-7 20-4-9-9-4Z"></path>
        <path d="M22 2 11 13"></path>
    </svg>
);

export const MicIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" x2="12" y1="19" y2="22"></line>
    </svg>
);

export const WalletIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
    </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6"></path>
    </svg>
);

export const BotIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 8V4H8"></path>
        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
        <path d="M2 14h2"></path><path d="M20 14h2"></path>
        <path d="M15 13v2"></path><path d="M9 13v2"></path>
    </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <g style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}>
            <path d="M3 21 V3 h18" opacity="0.5" />
            <path d="M7 12 V18">
                <animate attributeName="d" values="M7 12 V18; M7 8 V18; M7 12 V18" dur="2.5s" repeatCount="indefinite" />
            </path>
            <path d="M12 8 V18">
                 <animate attributeName="d" values="M12 8 V18; M12 14 V18; M12 8 V18" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
            </path>
            <path d="M17 4 V18">
                 <animate attributeName="d" values="M17 4 V18; M17 10 V18; M17 4 V18" dur="2.5s" begin="1s" repeatCount="indefinite" />
            </path>
        </g>
    </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
    </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
        <line x1="2" x2="22" y1="2" y2="22"></line>
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <path d="M12 9v4"></path>
        <path d="M12 17h.01"></path>
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m15 18-6-6 6-6"></path>
    </svg>
);

export const ArrowUpRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5 19.5 4.5M19.5 4.5v10.5M19.5 4.5H9" />
    </svg>
);

export const ArrowDownLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5 4.5 19.5M4.5 19.5v-10.5M4.5 19.5h10.5" />
    </svg>
);

export const ArrowsRightLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0L16.5 4.5M21 9H3" />
    </svg>
);

export const GlobeAltIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0 0 12 13.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 0 3 12c0 .778.099 1.533.284 2.253m18.148-4.506A11.953 11.953 0 0 1 12 15c-2.998 0-5.74-1.1-7.843-2.918m15.686 0" />
    </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const CircleStackIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
);

export const BitcoinIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8.5 14.5h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2" />
        <path d="M9 11.5h4" />
        <path d="M15 17v-2.5" />
        <path d="M15 9.5V7" />
    </svg>
);

export const EthereumIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M12 2l7 10-7 10-7-10z" />
        <path d="M12 22V12" />
        <path d="M5 12l7-5 7 5" />
        <path d="M5 12l7 10 7-10" />
    </svg>
);

export const SolanaIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M4 12.875h16" />
        <path d="M4 5.125h16" />
        <path d="M4 20.625h16" />
    </svg>
);

export const CurrencyDollarIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <g style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}>
            <circle cx="12" cy="12" r="10">
                <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
            </circle>
            <path d="M12 6 V18" />
            <path d="M15 9 C15 7.9, 13.657 7, 12 7 C10.343 7, 9 7.9, 9 9 C9 10.1, 10.343 11, 12 11 C13.657 11, 15 11.9, 15 13 C15 14.1, 13.657 15, 12 15 C10.343 15, 9 14.1, 9 13">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite" />
            </path>
        </g>
    </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const ClipboardIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <g style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}>
            <circle cx="12" cy="12" r="9" opacity="0.7"/>
            <path d="M12 6 V3" opacity="0.5" />
            <path d="M12 21 V18" opacity="0.5" />
            <path d="M18 12 H21" opacity="0.5" />
            <path d="M3 12 H6" opacity="0.5" />

            <line x1="12" y1="12" x2="12" y2="5">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="4s"
                    repeatCount="indefinite"
                />
            </line>
            
            <rect x="7" y="9" width="3" height="3" rx="1">
                 <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0s" repeatCount="indefinite" />
            </rect>
            <rect x="14" y="13" width="2" height="2" rx="0.5">
                 <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite" />
            </rect>
        </g>
    </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 30" className={className} preserveAspectRatio="none">
        <path d="M 0 28 C 20 28, 40 15, 60 15 S 80 2, 100 2" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const TrendingDownIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 100 30" className={className} preserveAspectRatio="none">
        <path d="M 0 2 C 20 2, 40 15, 60 15 S 80 28, 100 28" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const BNBIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} style={style}>
        <rect width="24" height="24" rx="4" fill="#F0B90B" />
        <path fill="white" d="M16.624 12l3.376-3.376-3.376-3.376-3.376 3.376 3.376 3.376zm-6.752 0l3.376-3.376-3.376-3.376-3.376 3.376 3.376 3.376zm0 6.752l3.376-3.376-3.376-3.376-3.376 3.376 3.376 3.376zm6.752 0l3.376-3.376-3.376-3.376-3.376 3.376 3.376 3.376zM12 14.252l-1.688-1.688 1.688-1.688 1.688 1.688-1.688 1.688z"/>
    </svg>
);

export const TetherIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M9 10h6"/>
        <path d="M12 10v7"/>
    </svg>
);

export const USDCIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8a4 4 0 1 0-8 0v8a4 4 0 1 0 8 0" />
        <path d="M12 6v12" />
    </svg>
);

export const XRPIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M13.297 5.003L6 12l7.297 6.997" />
        <path d="M10.703 18.997L18 12l-7.297-6.997" />
    </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

export const LogOutIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 6h18"></path>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

export const FingerPrintIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 12h.01" />
        <path d="M10 12h.01" />
        <path d="M14 12h.01" />
        <path d="M7 15v.01" />
        <path d="M7 9v.01" />
        <path d="M17 15v.01" />
        <path d="M17 9v.01" />
        <path d="M10 17v.01" />
        <path d="M14 17v.01" />
        <path d="M10 17v.01" />
        <path d="M14 17v.01" />
        <path d="M10 17v.01" />
        <path d="M14 17v.01" />
        <path d="M10 17v.01" />
        <path d="M14 17v.01" />
    </svg>
);

// BuySellActionIcon
export const BuySellActionIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2v20"></path><path d="m17 5 5 5-5 5"></path><path d="m7 19-5-5 5-5"></path>
    </svg>
);

// SendActionIcon (different from SendIcon usually used for chat)
export const SendActionIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

// ReceiveActionIcon
export const ReceiveActionIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2v20"></path><path d="m17 17-5 5-5-5"></path>
    </svg>
);

// SearchIcon
export const SearchIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

// ArrowDownIcon
export const ArrowDownIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
);

// SettingsIcon
export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

// LockIcon
export const LockIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

// QrCodeIcon
export const QrCodeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

// PolygonIcon
export const PolygonIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M12 2L2 8l10 6 10-6-10-6z"></path>
        <path d="M2 16l10 6 10-6"></path>
        <path d="M2 8v8"></path>
        <path d="M22 8v8"></path>
    </svg>
);

// ArbitrumIcon
export const ArbitrumIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M12 2l10 18H2L12 2z"></path>
        <path d="M12 16v6"></path>
        <path d="M8 12h8"></path>
    </svg>
);

// OptimismIcon
export const OptimismIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 12h8"></path>
    </svg>
);

// LineaIcon (Generic Layer 2 swirl)
export const LineaIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"></path>
    </svg>
);

// BaseIcon
export const BaseIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
    </svg>
);

// RefreshCwIcon
export const RefreshCwIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
        <path d="M21 3v5h-5"></path>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
        <path d="M8 16H3v5"></path>
    </svg>
);

// ChevronRightIcon
export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6"></path>
    </svg>
);

// PencilIcon
export const PencilIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
        <path d="m15 5 4 4"></path>
    </svg>
);

// SunIcon
export const SunIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
);

// MoonIcon
export const MoonIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
);

// ChainIcon
export const ChainIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
);

export const RocketIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
    </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
    </svg>
);
