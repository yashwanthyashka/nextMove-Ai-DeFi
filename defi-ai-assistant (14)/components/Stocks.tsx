import React, { useState, useEffect, memo } from 'react';
import { fetchTrendingStocks } from '../services/geminiService';
import type { TrendingStock } from '../types';
import { Card, Loader } from './UI';
import { SparklesIcon, PlusCircleIcon, MinusCircleIcon, SearchIcon } from './Icons';
import { StockActionModal } from './StockActionModal';
import { TradingViewChart } from './TradingViewChart';

const popularStocks = [
    { name: 'Apple', symbol: 'NASDAQ:AAPL' },
    { name: 'Tesla', symbol: 'NASDAQ:TSLA' },
    { name: 'NVIDIA', symbol: 'NASDAQ:NVDA' },
    { name: 'Google', symbol: 'NASDAQ:GOOGL' },
    { name: 'Amazon', symbol: 'NASDAQ:AMZN' },
    { name: 'Microsoft', symbol: 'NASDAQ:MSFT' },
];

const TrendingList: React.FC<{
    trending: TrendingStock[];
    isLoading: boolean;
    error: string | null;
    onSelect: (symbol: string) => void;
}> = ({ trending, isLoading, error, onSelect }) => {
    if (isLoading) return <Loader />;
    if (error) return <p className="text-red-400 text-center">{error}</p>;

    return (
        <Card className="p-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3">
                <SparklesIcon className="w-6 h-6 text-indigo-500 dark:text-[#f4ffb8]" />
                Trending Stocks
            </h3>
            <div className="space-y-2">
                {trending.map((stock, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(stock.symbol)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-[#f4ffb8]/50 transition-colors text-left"
                    >
                        <div>
                            <span className="font-semibold text-slate-900 dark:text-white">{stock.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{stock.symbol}</span>
                        </div>
                        <span className="text-lg font-mono text-gray-500">#{index + 1}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center justify-center gap-3 text-slate-800 dark:text-white bg-white/60 dark:bg-[#f4ffb8]/50 rounded-lg py-3 border border-gray-200 dark:border-[#f4ffb8] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group hover:bg-gray-200/80 dark:hover:bg-[#f4ffb8]/80 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-[#f4ffb8]/30">
      <div className="w-8 h-8 flex items-center justify-center">
          {icon}
      </div>
      <span className="text-md font-semibold">{label}</span>
    </button>
  );

interface StocksProps {
    theme: 'light' | 'dark';
}

export const Stocks: React.FC<StocksProps> = ({ theme }) => {
    const [activeSymbol, setActiveSymbol] = useState(popularStocks[0].symbol);
    const [trending, setTrending] = useState<TrendingStock[]>([]);
    const [isTrendingLoading, setIsTrendingLoading] = useState(true);
    const [trendingError, setTrendingError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'buy' | 'sell' | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadTrending = async () => {
            try {
                setIsTrendingLoading(true);
                setTrendingError(null);
                const trendingStocks = await fetchTrendingStocks();
                setTrending(trendingStocks);
            } catch (err) {
                setTrendingError("Failed to load trending stocks.");
                console.error(err);
            } finally {
                setIsTrendingLoading(false);
            }
        };
        loadTrending();
    }, []);

    const handleActionClick = (action: 'buy' | 'sell') => {
        setModalAction(action);
        setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setModalAction(null), 300);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setActiveSymbol(searchQuery.trim().toUpperCase());
        }
    };

    return (
        <>
            <div className="flex flex-col h-full p-4">
                <div className="grid grid-cols-2 gap-4 mb-4 animate-fade-in-up">
                    <ActionButton icon={<PlusCircleIcon className="w-7 h-7 text-[#f4ffb8]" />} label="Buy" onClick={() => handleActionClick('buy')} />
                    <ActionButton icon={<MinusCircleIcon className="w-7 h-7 text-red-500" />} label="Sell" onClick={() => handleActionClick('sell')} />
                </div>
                
                <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search stocks (e.g., NASDAQ:AAPL)"
                            className="w-full bg-gray-200/60 dark:bg-gray-800/60 rounded-full py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 border-2 border-transparent focus:border-indigo-500 dark:focus:border-[#f4ffb8] focus:ring-0 transition-colors"
                        />
                        <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2" aria-label="Search">
                            <SearchIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </form>
                </div>

                <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {popularStocks.map(item => (
                            <button 
                                key={item.symbol}
                                onClick={() => setActiveSymbol(item.symbol)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-300 transform hover:-translate-y-0.5 ${activeSymbol === item.symbol ? 'bg-indigo-600 dark:bg-[#f4ffb8] text-white shadow-md shadow-indigo-200 dark:shadow-[#f4ffb8]/40' : 'bg-gray-200 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/70'}`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-grow bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-[#f4ffb8]/50 rounded-xl overflow-hidden min-h-[300px] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <TradingViewChart symbol={activeSymbol} theme={theme} interval="D" allowSymbolChange={true} />
                </div>

                <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <TrendingList
                        trending={trending}
                        isLoading={isTrendingLoading}
                        error={trendingError}
                        onSelect={(symbol) => setActiveSymbol(symbol)}
                    />
                </div>
            </div>
            {modalAction && (
                <StockActionModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    action={modalAction}
                />
            )}
        </>
    );
};