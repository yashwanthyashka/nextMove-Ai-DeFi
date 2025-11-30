import React from 'react';

export const CyberpunkGlitchBackground: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <img
                src="https://cdn.pixabay.com/photo/2024/02/23/18/28/background-8592451_1280.jpg"
                alt="Cyberpunk circuit board background"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70"></div>
        </div>
    );
};
