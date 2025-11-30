
import React, { useState } from 'react';
import type { Token, Wallet } from '../types';
import { ChevronLeftIcon, PlusCircleIcon, MinusCircleIcon, ArrowsRightLeftIcon, TrendingUpIcon, TrendingDownIcon } from './Icons';
import { TradingViewChart } from './TradingViewChart';
import { ActionModal, ActionType } from './ActionModal';

interface TokenDetailProps { token: Token; onBack: () => void; wallet: Wallet; signer: any; }

const formatPrice = (price: number): string => { if (price >= 1) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; return price > 0 ? `$${price.toFixed(8)}` : '$0.00'; };

export const TokenDetail: React.FC<TokenDetailProps> = ({ token, onBack, wallet, signer }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
    const isPositive = token.priceChangePercentage24h >= 0;
    const handleAction = (action: ActionType) => { setCurrentAction(action); setIsModalOpen(true); };

    return (
        <div className="h-full flex flex-col p-4 animate-fade-in-up">
            <div className="flex-shrink-0 flex items-center gap-4 mb-4">
                <button onClick={onBack} className="p-2 bg-gray-800 rounded-full"><ChevronLeftIcon className="w-6 h-6 text-white" /></button>
                <img src={token.logo} className="w-10 h-10 rounded-full" />
                <div><h2 className="text-xl font-bold text-white">{token.name}</h2><p className="text-sm text-gray-400">{token.symbol}</p></div>
            </div>
            <div className="flex-shrink-0 mb-6 text-center">
                <p className="text-4xl font-bold text-white">{formatPrice(token.price || 0)}</p>
                <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-base font-semibold ${isPositive ? 'bg-[#f4ffb8]/20 text-[#f4ffb8]' : 'bg-red-500/20 text-red-500'}`}>{isPositive ? <TrendingUpIcon className="w-5 h-2.5" /> : <TrendingDownIcon className="w-5 h-2.5" />}{token.priceChangePercentage24h.toFixed(2)}%</div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-3 gap-4 mb-6">
                <button onClick={() => handleAction('buy_sell')} className="flex flex-col items-center gap-2"><div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center"><PlusCircleIcon className="w-7 h-7 text-white"/></div><span className="text-sm font-semibold text-white">Buy</span></button>
                <button onClick={() => handleAction('buy_sell')} className="flex flex-col items-center gap-2"><div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center"><MinusCircleIcon className="w-7 h-7 text-white"/></div><span className="text-sm font-semibold text-white">Sell</span></button>
                <button onClick={() => handleAction('swap')} className="flex flex-col items-center gap-2"><div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center"><ArrowsRightLeftIcon className="w-7 h-7 text-white"/></div><span className="text-sm font-semibold text-white">Swap</span></button>
            </div>
            <div className="flex-grow bg-gray-900 rounded-xl overflow-hidden min-h-[300px]"><TradingViewChart symbol={`BINANCE:${token.symbol}USDT`} allowSymbolChange={true} /></div>
            {currentAction && <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} action={currentAction} wallet={wallet} signer={signer} />}
        </div>
    );
};
