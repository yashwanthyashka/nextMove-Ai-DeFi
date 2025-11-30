
import React, { useState, useEffect, memo } from 'react';
import { fetchTrendingCryptos } from '../services/geminiService';
import type { TrendingCrypto } from '../types';
import { Card, Loader } from './UI';
import { SparklesIcon } from './Icons';
import { TradingViewChart } from './TradingViewChart';

const popularSymbols = [
    { name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT' },
    { name: 'Ethereum', symbol: 'BINANCE:ETHUSDT' },
    { name: 'Solana', symbol: 'BINANCE:SOLUSDT' },
    { name: 'BNB', symbol: 'BINANCE:BNBUSDT' },
    { name: 'Pepe', symbol: 'BINANCE:PEPEUSDT' },
    { name: 'Dogecoin', symbol: 'BINANCE:DOGEUSDT' },
];

const TrendingList: React.FC<{
    trending: TrendingCrypto[];
    isLoading: boolean;
    error: string | null;
    onSelect: (symbol: string) => void;
}> = ({ trending, isLoading, error, onSelect }) => {
    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <p className="text-red-400 text-center">{error}</p>;
    }

    return (
        <Card className="p-4 dark:border-[#89F336]/30">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3">
                <SparklesIcon className="w-6 h-6 text-[#89F336]" />
                Trending Cryptos
            </h3>
            <div className="space-y-2">
                {trending.map((crypto, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(crypto.symbol)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-[#89F336]/20 transition-colors text-left"
                    >
                        <div>
                            <span className="font-semibold text-slate-900 dark:text-white">{crypto.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{crypto.symbol}</span>
                        </div>
                        <span className="text-lg font-mono text-gray-500">#{index + 1}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};

interface ChartsProps {
    theme: 'light' | 'dark';
}

export const Charts: React.FC<ChartsProps> = ({ theme }) => {
    const [activeSymbol, setActiveSymbol] = useState(popularSymbols[0].symbol);
    const [trending, setTrending] = useState<TrendingCrypto[]>([]);
    const [isTrendingLoading, setIsTrendingLoading] = useState(true);
    const [trendingError, setTrendingError] = useState<string | null>(null);

    useEffect(() => {
        const loadTrending = async () => {
            try {
                setIsTrendingLoading(true);
                setTrendingError(null);
                const trendingCryptos = await fetchTrendingCryptos();
                setTrending(trendingCryptos);
            } catch (err) {
                setTrendingError("Failed to load trending cryptos.");
                console.error(err);
            } finally {
                setIsTrendingLoading(false);
            }
        };
        loadTrending();
    }, []);

    return (
        <div className="flex flex-col h-full p-4">
            <div className="mb-4 animate-fade-in-up">
                <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {popularSymbols.map(item => (
                        <button 
                            key={item.symbol}
                            onClick={() => setActiveSymbol(item.symbol)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-300 transform hover:-translate-y-0.5 ${activeSymbol === item.symbol ? 'bg-[#89F336] text-black shadow-md shadow-[#89F336]/40' : 'bg-gray-200 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/70'}`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-[#89F336]/50 rounded-xl overflow-hidden min-h-[300px] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <TradingViewChart symbol={activeSymbol} theme={theme} allowSymbolChange={true} />
            </div>

            <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <TrendingList
                    trending={trending}
                    isLoading={isTrendingLoading}
                    error={trendingError}
                    onSelect={(symbol) => setActiveSymbol(`BINANCE:${symbol}USDT`)}
                />
            </div>
        </div>
    );
};
