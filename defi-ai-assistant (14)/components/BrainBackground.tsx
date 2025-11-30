import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points as DreiPoints } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';

// A component for the pulsing nodes
const PulsingNodes = ({ positions }: { positions: Float32Array }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const material = useMemo(() => new THREE.PointsMaterial({
        transparent: true,
        color: '#f4ffb8',
        size: 0.04,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }), []);

    useFrame(({ clock }) => {
        // The material's size is animated imperatively.
        material.size = 0.04 + Math.sin(clock.getElapsedTime() * 3) * 0.02;
    });

    // Fix: Replaced R3F JSX with React.createElement to bypass TypeScript errors
    // due to missing JSX namespace definitions for react-three-fiber.
    return React.createElement(DreiPoints, { ref: pointsRef, positions: positions, stride: 3 },
        React.createElement('primitive', { object: material, attach: 'material' })
    );
};


// The main model component including nodes, connections, and particles
const BrainModel = () => {
    const groupRef = useRef<THREE.Group>(null);

    const [nodePositions, connections, particles] = useMemo(() => {
        // Brain geometry
        const geometry = new THREE.IcosahedronGeometry(1.8, 5); // ~252 nodes. Radius 1.8
        const positions = new Float32Array(geometry.attributes.position.array);
        const edges = new THREE.EdgesGeometry(geometry);

        // Surrounding particles
        const particleCount = 40;
        const particlePositions = new Float32Array(particleCount * 3);
        const radius = 3;
        for (let i = 0; i < particleCount; i++) {
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 2;
            const y = radius * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 2;
            const z = radius * Math.cos(phi) + (Math.random() - 0.5) * 2;
            particlePositions.set([x, y, z], i * 3);
        }

        return [positions, edges, particlePositions];
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Slow rotation on Y-axis (20 seconds per full rotation)
            groupRef.current.rotation.y += delta * (Math.PI / 10); 
        }
    });

    const lineSegmentsObject = useMemo(() => new THREE.LineSegments(
        connections,
        new THREE.LineBasicMaterial({ color: '#f4ffb8', transparent: true, opacity: 0.3 })
    ), [connections]);

    const particleMaterialObject = useMemo(() => new THREE.PointsMaterial({
        transparent: true,
        color: '#f4ffb8',
        size: 0.03,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }), []);

    // Fix: Replaced R3F JSX with React.createElement to bypass TypeScript errors
    // due to missing JSX namespace definitions for react-three-fiber.
    return React.createElement('group', { ref: groupRef },
        React.createElement(PulsingNodes, { positions: nodePositions, key: 'nodes' }),
        React.createElement('primitive', { object: lineSegmentsObject, key: 'lines' }),
        React.createElement(DreiPoints, { positions: particles, stride: 3, key: 'particles' },
            React.createElement('primitive', { object: particleMaterialObject, attach: 'material' })
        )
    );
};

// Component to imperatively set up scene properties to avoid TS errors with <color> and <fog> JSX tags.
const SceneSetup = () => {
    const { scene } = useThree();
    useEffect(() => {
        scene.background = new THREE.Color('#0a0a0a');
        scene.fog = new THREE.Fog('#0a0a0a', 6, 12);
    }, [scene]);
    return null;
};


// The main export component setting up the scene
const BrainBackground: React.FC = () => {
    return (
        <Canvas
            dpr={[1, 2]} // Pixel ratio for performance on high-res screens
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ antialias: true, alpha: true }} // alpha for transparent background
        >
            <SceneSetup />
            
            <BrainModel />
            
            <EffectComposer>
                <Bloom 
                    luminanceThreshold={0} 
                    intensity={1.5} 
                    levels={9} 
                    mipmapBlur 
                />
                <DepthOfField 
                    target={[0, 0, 0]} 
                    focalLength={0.05} 
                    bokehScale={8} 
                    height={480} 
                />
            </EffectComposer>
        </Canvas>
    );
};

export default BrainBackground;
