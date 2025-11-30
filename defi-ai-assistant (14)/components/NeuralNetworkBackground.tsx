import React from 'react';

// A sub-component to render one layer of the network
const NetworkLayer: React.FC<{
    nodeCount: number;
    className?: string;
    animationName: string;
    nodeRadiusRange: [number, number];
    connectionOpacity: number;
}> = ({ nodeCount, className, animationName, nodeRadiusRange, connectionOpacity }) => {
    const nodes = React.useMemo(() => Array.from({ length: nodeCount }).map(() => ({
        cx: Math.random() * 100,
        cy: Math.random() * 100,
        r: Math.random() * (nodeRadiusRange[1] - nodeRadiusRange[0]) + nodeRadiusRange[0],
    })), [nodeCount, nodeRadiusRange]);

    const connections = React.useMemo(() => {
        const lines = [];
        for (let i = 0; i < nodeCount; i++) {
            const numConnections = Math.floor(Math.random() * 2) + 1; // 1 to 2 connections
            for (let j = 0; j < numConnections; j++) {
                const targetIndex = Math.floor(Math.random() * nodeCount);
                if (i !== targetIndex) {
                    const dist = Math.sqrt(
                        Math.pow(nodes[i].cx - nodes[targetIndex].cx, 2) +
                        Math.pow(nodes[i].cy - nodes[targetIndex].cy, 2)
                    );
                    if (dist < 40) { // Only draw connections for nodes that are reasonably close
                        lines.push({
                            x1: nodes[i].cx,
                            y1: nodes[i].cy,
                            x2: nodes[targetIndex].cx,
                            y2: nodes[targetIndex].cy,
                        });
                    }
                }
            }
        }
        return lines;
    }, [nodes, nodeCount]);

    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            className={`absolute inset-0 w-full h-full ${className}`}
        >
            <g className={animationName}>
                {connections.map((line, i) => (
                    <line
                        key={`line-${i}`}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="white"
                        strokeWidth="0.08"
                        strokeOpacity={connectionOpacity}
                    />
                ))}
                {nodes.map((node, i) => (
                    <circle
                        key={`node-${i}`}
                        cx={node.cx}
                        cy={node.cy}
                        r={node.r}
                        fill="white"
                    >
                        <animate
                            attributeName="opacity"
                            values="0.3;1;0.3"
                            dur={`${Math.random() * 5 + 4}s`}
                            repeatCount="indefinite"
                            begin={`${Math.random() * 4}s`}
                        />
                         <animate
                            attributeName="r"
                            values={`${node.r};${node.r * 2};${node.r}`}
                            dur={`${Math.random() * 6 + 5}s`}
                            repeatCount="indefinite"
                            begin={`${Math.random() * 5}s`}
                        />
                    </circle>
                ))}
            </g>
        </svg>
    );
};

const NeuralNetworkBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden [perspective:1000px]">
            {/* Background Layer */}
            <NetworkLayer
                nodeCount={40}
                className="opacity-20"
                animationName="brain-float-back"
                nodeRadiusRange={[0.1, 0.4]}
                connectionOpacity={0.5}
            />
            {/* Midground Layer */}
            <NetworkLayer
                nodeCount={30}
                className="opacity-30"
                animationName="brain-float-mid"
                nodeRadiusRange={[0.2, 0.6]}
                connectionOpacity={0.7}
            />
            {/* Foreground Layer */}
            <NetworkLayer
                nodeCount={20}
                className="opacity-40"
                animationName="brain-float-front"
                nodeRadiusRange={[0.3, 0.8]}
                connectionOpacity={0.8}
            />

            <style>{`
                /* Background: Slow, distant, less rotation */
                @keyframes brain-float-back {
                    0% { transform: rotateY(-10deg) rotateX(5deg) translateY(-2%) scale(1.4); }
                    50% { transform: rotateY(10deg) rotateX(-5deg) translateY(2%) scale(1.4); }
                    100% { transform: rotateY(-10deg) rotateX(5deg) translateY(-2%) scale(1.4); }
                }
                .brain-float-back {
                    animation: brain-float-back 60s ease-in-out infinite;
                    transform-origin: 50% 50%;
                }

                /* Midground: Medium speed and rotation */
                @keyframes brain-float-mid {
                    0% { transform: rotateY(-15deg) rotateX(10deg) translateY(-3%) scale(1.3); }
                    50% { transform: rotateY(15deg) rotateX(-10deg) translateY(3%) scale(1.3); }
                    100% { transform: rotateY(-15deg) rotateX(10deg) translateY(-3%) scale(1.3); }
                }
                .brain-float-mid {
                    animation: brain-float-mid 45s ease-in-out infinite;
                    transform-origin: 50% 50%;
                }

                /* Foreground: Faster, closer, more rotation */
                @keyframes brain-float-front {
                    0% { transform: rotateY(-20deg) rotateX(15deg) translateY(-5%) scale(1.2); }
                    50% { transform: rotateY(20deg) rotateX(-15deg) translateY(5%) scale(1.2); }
                    100% { transform: rotateY(-20deg) rotateX(15deg) translateY(-5%) scale(1.2); }
                }
                .brain-float-front {
                    animation: brain-float-front 30s ease-in-out infinite;
                    transform-origin: 50% 50%;
                }
            `}</style>
        </div>
    );
};

export default NeuralNetworkBackground;
