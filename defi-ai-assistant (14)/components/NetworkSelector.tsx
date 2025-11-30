import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Network } from '../types';
import { ChainIcon, CheckCircleIcon, ChevronDownIcon, PlusCircleIcon, SearchIcon, XMarkIcon } from './Icons';
import { Loader } from './UI';

interface NetworkSelectorProps {
    activeNetwork: Network;
    networks: Network[];
    onSelectNetwork: (network: Network) => void;
}

const AddNetworkModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
     if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex justify-center items-center z-[60] p-4">
            <div className="bg-slate-900/80 border border-[#f4ffb8]/50 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 [transform-style:preserve-3d] animate-modal-pop-in">
                 <div className="flex justify-between items-center p-4 border-b border-[#f4ffb8]/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">Add Custom Network</h2>
                        <p className="text-sm text-gray-400">Configure RPC endpoint</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                </div>
                 <div className="p-6 space-y-4">
                    <p className="text-center text-gray-300">This feature is for advanced users and is coming soon.</p>
                     <button disabled className="w-full mt-2 bg-gray-600 text-white font-semibold py-3 rounded-lg cursor-not-allowed">
                        Add Network
                    </button>
                 </div>
            </div>
        </div>
    );
};


export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ activeNetwork, networks, onSelectNetwork }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    const handleToggleDropdown = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            
            setDropdownStyle({
                position: 'fixed',
                top: `${rect.bottom + 8}px`, // 8px margin
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                maxHeight: `${spaceBelow - 16}px` // 16px margin from bottom edge
            });
        }
        setIsOpen(!isOpen);
    };

    const handleSelect = (network: Network) => {
        onSelectNetwork(network);
        setIsOpen(false);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
                panelRef.current && !panelRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const mainnets = networks.filter(n => n.type === 'Mainnet' || n.type === 'Layer 2');
    const testnets = networks.filter(n => n.type === 'Testnet');

    return (
        <div ref={buttonRef}>
             <div
                className="relative p-[1.5px] rounded-xl overflow-hidden group transition-all duration-300"
            >
                <div className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] [background:conic-gradient(from_90deg_at_50%_50%,#0000_0%,#f4ffb8_50%,#0000_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                    <button
                        onClick={handleToggleDropdown}
                        className={`w-full px-3 py-2 flex items-center justify-between bg-[#062c22] rounded-[11px]`}
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-900">
                                <activeNetwork.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-base leading-tight">{activeNetwork.name}</p>
                                <p className="text-xs text-gray-400 leading-tight">{activeNetwork.longName}</p>
                            </div>
                        </div>
                        <ChevronDownIcon className={`w-6 h-6 text-[#f4ffb8] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            
            {/* Dropdown Panel */}
            {isOpen && createPortal(
                <div
                    ref={panelRef}
                    style={dropdownStyle}
                    className="z-[55] animate-slide-down"
                >
                    <div className="h-full bg-[rgba(10,10,10,0.95)] backdrop-blur-2xl border border-[#f4ffb8]/80 rounded-2xl shadow-[0px_20px_60px_rgba(244,255,184,0.3)] overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-[#f4ffb8]/20">
                            <h2 className="text-xl font-bold text-white">Select Network</h2>
                        </div>
                        <div className="flex-grow overflow-y-auto p-3">
                            {/* Popular Networks */}
                            <div className="px-2 pt-2 pb-1">
                                <h3 className="flex items-center gap-2 text-xs font-semibold text-[#f4ffb8] uppercase tracking-wider">
                                    <ChainIcon className="w-3 h-3"/> Popular Networks
                                </h3>
                            </div>
                            <div className="space-y-2 py-2">
                                {mainnets.map((network, i) => (
                                    <button 
                                        key={network.id}
                                        onClick={() => handleSelect(network)}
                                        className="w-full h-16 px-3 flex items-center gap-3 bg-[rgba(26,26,26,0.6)] rounded-xl border border-[#f4ffb8]/20 hover:bg-[#f4ffb8]/10 hover:border-[#f4ffb8]/60 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up"
                                        style={{ animationDelay: `${i * 50}ms`}}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative ${network.id === activeNetwork.id ? 'ring-2 ring-[#f4ffb8] ring-offset-2 ring-offset-black/50' : ''}`}>
                                             <network.icon className="w-full h-full" />
                                        </div>
                                        <div className="flex-grow text-left">
                                            <p className="font-medium text-white text-sm">{network.name}</p>
                                            <p className="text-xs text-gray-400">{network.longName}</p>
                                        </div>
                                        {network.id === activeNetwork.id && <CheckCircleIcon className="w-6 h-6 text-[#f4ffb8] filter drop-shadow-[0_0_5px_#f4ffb8]" />}
                                    </button>
                                ))}
                            </div>
                            
                             {/* Test Networks */}
                            <div className="px-2 pt-4 pb-1">
                                <h3 className="flex items-center gap-2 text-xs font-semibold text-[#f4ffb8] uppercase tracking-wider">
                                    <ChainIcon className="w-3 h-3"/> Test Networks
                                </h3>
                            </div>
                             <div className="space-y-2 py-2">
                                {testnets.map((network, i) => (
                                    <button 
                                        key={network.id}
                                        onClick={() => handleSelect(network)}
                                        className="w-full h-16 px-3 flex items-center gap-3 bg-[rgba(26,26,26,0.6)] rounded-xl border border-[#f4ffb8]/20 hover:bg-[#f4ffb8]/10 hover:border-[#f4ffb8]/60 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up"
                                        style={{ animationDelay: `${(mainnets.length + i) * 50}ms`}}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative ${network.id === activeNetwork.id ? 'ring-2 ring-[#f4ffb8] ring-offset-2 ring-offset-black/50' : ''}`}>
                                             <network.icon className="w-full h-full" />
                                        </div>
                                        <div className="flex-grow text-left">
                                            <p className="font-medium text-white text-sm">{network.name}</p>
                                            <p className="text-xs text-gray-400">{network.longName}</p>
                                        </div>
                                        {network.id === activeNetwork.id && <CheckCircleIcon className="w-6 h-6 text-[#f4ffb8] filter drop-shadow-[0_0_5px_#f4ffb8]" />}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => { setIsOpen(false); setIsAddModalOpen(true); }}
                                    className="w-full h-16 px-3 flex items-center gap-3 bg-transparent rounded-xl border-2 border-dashed border-[#f4ffb8]/40 hover:bg-[#f4ffb8]/10 hover:border-[#f4ffb8]/60 transition-all duration-300 transform hover:scale-[1.02]"
                                >
                                    <PlusCircleIcon className="w-8 h-8 text-[#f4ffb8]" />
                                     <div className="flex-grow text-left">
                                        <p className="font-medium text-white text-sm">Add Custom Network</p>
                                        <p className="text-xs text-gray-400">Configure RPC endpoint</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            <AddNetworkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
             <style>{`
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
                @keyframes modal-pop-in {
                  from { opacity: 0; transform: scale(0.9) rotateX(-20deg); }
                  to { opacity: 1; transform: scale(1) rotateX(0deg); }
                }
                .animate-modal-pop-in { animation: modal-pop-in 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};