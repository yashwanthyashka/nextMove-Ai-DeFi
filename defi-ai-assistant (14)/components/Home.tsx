
import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Token, Wallet, StoredWallet, Network } from '../types';
import { SendActionIcon, ReceiveActionIcon, ArrowsRightLeftIcon, GlobeAltIcon, TrendingUpIcon, TrendingDownIcon, SearchIcon, ArrowDownIcon, PhotoIcon, ClockIcon } from './Icons';
import { ActionModal, ActionType } from './ActionModal';
import { Loader } from './UI';
import { TokenDetail } from './TokenDetail';
import { NetworkSelector } from './NetworkSelector';

interface ProcessedWallet extends Wallet {
    totalUsdValue: number;
    change24h: { percentage: number; absolute: number; };
}

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 group focus:outline-none">
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-neutral-900 dark:to-black border border-slate-300/50 dark:border-[#d5fad3]/30 shadow-lg dark:shadow-2xl dark:shadow-black/50 transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-xl dark:group-hover:shadow-[#d5fad3]/20 group-active:translate-y-0 group-active:scale-95">
            <div className="text-slate-800 dark:text-[#d5fad3] transition-colors">{icon}</div>
        </div>
        <span className="text-xs font-semibold tracking-tight text-slate-700 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
    </button>
);

const TokenRow: React.FC<{ token: Token; onSelect: (token: Token) => void; isWalletView?: boolean; }> = ({ token, onSelect, isWalletView }) => {
    return (
        <button onClick={() => onSelect(token)} className="w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 text-left group hover:bg-[#d5fad3]/5">
            <img src={token.logo} alt={token.name} className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-grow truncate">
                <div className="font-semibold text-slate-900 dark:text-white truncate">{token.symbol}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{token.name}</div>
            </div>
            <div className="text-right flex-shrink-0">
                <div className="font-semibold text-slate-900 dark:text-white">{parseFloat(token.balance).toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">${token.usdValue.toFixed(2)}</div>
            </div>
        </button>
    );
};

interface HomeProps {
    signer: any; // Aptos Account
    wallet: ProcessedWallet;
    marketTokens: Token[];
    isLoading: boolean;
    allWallets: StoredWallet[];
    activeWalletIndex: number;
    activeNetwork: Network;
    networks: Network[];
    onSelectNetwork: (network: Network) => void;
    onSwitchWallet: (index: number) => void;
    onAddWallet: (data: { name: string, wallet: any }) => void;
    onRefresh: () => Promise<void>;
}

export const Home: React.FC<HomeProps> = ({ signer, wallet, marketTokens, isLoading, activeNetwork, networks, onSelectNetwork, onRefresh }) => {
    const [activeTab, setActiveTab] = useState<'wallet' | 'market'>('wallet');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);

    const handleAction = (action: ActionType) => { setCurrentAction(action); setIsModalOpen(true); };

    if (selectedToken) return <TokenDetail token={selectedToken} onBack={() => setSelectedToken(null)} wallet={wallet} signer={signer} />;

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 pt-4 text-center animate-fade-in-up">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Balance</div>
                <div className="text-4xl font-bold tracking-tighter">${wallet.totalUsdValue.toFixed(2)}</div>
            </div>
            <div className="px-4 py-2 animate-fade-in-up">
                <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-[#d5fad3]/30 p-4 shadow-lg">
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <ActionButton icon={<SendActionIcon className="w-6 h-6" />} label="Send" onClick={() => handleAction('send')} />
                        <ActionButton icon={<ReceiveActionIcon className="w-7 h-7" />} label="Receive" onClick={() => handleAction('receive')} />
                        <ActionButton icon={<ArrowsRightLeftIcon className="w-6 h-6" />} label="Swap" onClick={() => handleAction('swap')} />
                        <ActionButton icon={<GlobeAltIcon className="w-6 h-6" />} label="Bridge" onClick={() => handleAction('bridge')} />
                    </div>
                </div>
            </div>
            <div className="flex-grow flex flex-col mt-2 bg-white/60 dark:bg-[#050505] rounded-t-3xl overflow-hidden animate-fade-in-up">
                <div className="flex p-4 gap-4">
                    <button onClick={() => setActiveTab('wallet')} className={`font-bold ${activeTab === 'wallet' ? 'text-white' : 'text-gray-500'}`}>Wallet</button>
                    <button onClick={() => setActiveTab('market')} className={`font-bold ${activeTab === 'market' ? 'text-white' : 'text-gray-500'}`}>Market</button>
                </div>
                <div className="flex-grow overflow-y-auto px-4 pb-4">
                    {activeTab === 'wallet' && wallet.tokens.map(t => <TokenRow key={t.symbol} token={t} onSelect={setSelectedToken} isWalletView />)}
                    {activeTab === 'market' && marketTokens.map(t => <TokenRow key={t.symbol} token={t} onSelect={setSelectedToken} />)}
                </div>
            </div>
            {currentAction && <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} action={currentAction} wallet={wallet} signer={signer} />}
        </div>
    );
};
