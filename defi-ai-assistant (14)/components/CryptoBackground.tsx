import React from 'react';
import { BitcoinIcon, EthereumIcon, SolanaIcon } from './Icons';

const COIN_TYPES = [
    { Icon: BitcoinIcon, color: 'text-yellow-500/50' },
    { Icon: EthereumIcon, color: 'text-sky-400/50' },
    { Icon: SolanaIcon, color: 'text-fuchsia-500/50' }
];

const COINS_TO_RENDER = Array.from({ length: 20 }).map((_, i) => {
    const type = COIN_TYPES[i % COIN_TYPES.length];
    const size = Math.random() * 40 + 20; // size between 20px and 60px
    return {
        id: i,
        Icon: type.Icon,
        color: type.color,
        style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            animation: `float3d ${Math.random() * 15 + 10}s infinite ease-in-out`,
            animationDelay: `${Math.random() * -25}s`, // Negative delay starts animation partway through
        }
    };
});

export const CryptoBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden [transform-style:preserve-3d]">
            {COINS_TO_RENDER.map(coin => (
                <div key={coin.id} className="absolute" style={coin.style}>
                    <coin.Icon className={`${coin.color} w-full h-full filter blur-[1px]`} />
                </div>
            ))}
        </div>
    );
};
