
import React, { useState, useEffect } from 'react';
import { DecibelService } from '../services/decibelService';
import type { DecibelMarket, DecibelOrderBook, DecibelTrade } from '../types';
import { Card, Loader } from './UI';
import { SparklesIcon, PlusCircleIcon, MinusCircleIcon, SearchIcon, TrendingUpIcon, TrendingDownIcon, ClockIcon, BrainCircuitIcon } from './Icons';
import { StockActionModal } from './StockActionModal';
import { TradingViewChart } from './TradingViewChart';
import { analyzeMarketWithAI } from '../services/geminiService';

// Helper to map Decibel symbols to TradingView symbols
const getTradingViewSymbol = (decibelId: string): string => {
    // Basic mapping logic
    const base = decibelId.split('-')[0];
    return `BINANCE:${base}USDT`;
};

const OrderBookPanel: React.FC<{ orderBook: DecibelOrderBook | null, isLoading: boolean }> = ({ orderBook, isLoading }) => {
    if (isLoading || !orderBook) return <div className="h-full flex items-center justify-center min-h-[200px]"><Loader /></div>;

    const maxTotal = Math.max(
        ...orderBook.bids.map(b => b[1]),
        ...orderBook.asks.map(a => a[1])
    );

    return (
        <Card className="p-3 h-full overflow-hidden flex flex-col bg-slate-900/50 border-[#f4ffb8]/30">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex justify-between">
                <span>Price (USD)</span>
                <span>Size</span>
            </h4>
            <div className="flex-grow overflow-y-auto font-mono text-xs relative space-y-0.5 scrollbar-thin scrollbar-thumb-[#f4ffb8]/50">
                {/* Asks (Red, Sell Orders) - Reversed to show lowest ask at bottom */}
                <div className="flex flex-col-reverse">
                    {orderBook.asks.slice(0, 8).map((ask, i) => (
                        <div key={`ask-${i}`} className="flex justify-between relative group">
                            <div 
                                className="absolute right-0 top-0 bottom-0 bg-red-500/10 transition-all duration-300" 
                                style={{ width: `${(ask[1] / maxTotal) * 100}%` }}
                            />
                            <span className="text-red-400 relative z-10">{ask[0].toFixed(2)}</span>
                            <span className="text-gray-300 relative z-10">{ask[1].toFixed(4)}</span>
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-b border-gray-700 py-1 my-1 text-center text-gray-500 text-[10px]">
                    Spread
                </div>

                {/* Bids (Green, Buy Orders) */}
                <div className="space-y-1">
                    {orderBook.bids.slice(0, 8).map((bid, i) => (
                        <div key={`bid-${i}`} className="flex justify-between relative group">
                            <div
                                className="absolute right-0 top-0 bottom-0 bg-[#f4ffb8]/10 transition-all duration-300"
                                style={{ width: `${(bid[1] / maxTotal) * 100}%` }}
                            />
                            <span className="text-[#f4ffb8] relative z-10">{bid[0].toFixed(2)}</span>
                            <span className="text-gray-300 relative z-10">{bid[1].toFixed(4)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

const RecentTradesList: React.FC<{ trades: DecibelTrade[], isLoading: boolean }> = ({ trades, isLoading }) => {
    if (isLoading && trades.length === 0) return <div className="h-full flex items-center justify-center min-h-[150px]"><Loader /></div>;
    
    return (
        <Card className="p-3 h-full max-h-[300px] overflow-hidden flex flex-col bg-slate-900/50 border-[#f4ffb8]/30">
             <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex justify-between px-1">
                <span>Price</span>
                <span>Size</span>
                <span>Time</span>
            </h3>
            <div className="flex-grow overflow-y-auto space-y-1 pr-1 font-mono text-xs scrollbar-thin scrollbar-thumb-[#f4ffb8]/50">
                {trades.map((trade) => (
                    <div key={trade.id} className="flex justify-between items-center px-1 py-0.5 hover:bg-white/5 rounded">
                        <span className={trade.side === 'buy' ? 'text-[#89F336]' : 'text-red-400'}>
                            {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-gray-300">{trade.size.toFixed(4)}</span>
                        <span className="text-gray-500 text-[10px]">
                            {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                ))}
                {trades.length === 0 && <div className="text-center text-gray-500 py-4">No recent trades</div>}
            </div>
        </Card>
    );
};

const MarketList: React.FC<{
    markets: DecibelMarket[];
    isLoading: boolean;
    activeMarketId: string;
    onSelect: (market: DecibelMarket) => void;
}> = ({ markets, isLoading, activeMarketId, onSelect }) => {
    if (isLoading) return <Loader />;

    return (
        <Card className="p-4 bg-slate-900/50 border-[#89F336]/30 h-full max-h-[300px] flex flex-col">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3">
                <SparklesIcon className="w-5 h-5 text-[#f4ffb8]" />
                Decibel Markets
            </h3>
            <div className="space-y-1 flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#89F336]/50">
                {markets.map((market) => (
                    <button
                        key={market.market_id}
                        onClick={() => onSelect(market)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${activeMarketId === market.market_id ? 'bg-[#f4ffb8]/20 border border-[#f4ffb8]/30' : 'hover:bg-gray-200/50 dark:hover:bg-[#f4ffb8]/30'}`}
                    >
                        <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">{market.market_id}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Vol: ${(market.volume_24h / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="text-right">
                            <span className="block font-mono text-sm text-slate-800 dark:text-white">${market.price.toLocaleString()}</span>
                            <span className={`text-xs ${market.change_24h >= 0 ? 'text-[#f4ffb8]' : 'text-red-400'}`}>
                                {market.change_24h >= 0 ? '+' : ''}{market.change_24h}%
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </Card>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; colorClass: string }> = ({ icon, label, onClick, colorClass }) => (
    <button onClick={onClick} className={`flex items-center justify-center gap-2 ${colorClass} text-white rounded-lg py-3 px-4 border border-transparent transition-all duration-300 transform hover:scale-105 shadow-lg`}>
      <div className="w-5 h-5 flex items-center justify-center">
          {icon}
      </div>
      <span className="text-sm font-bold uppercase tracking-wide">{label}</span>
    </button>
);

const DecibelAskAI: React.FC<{ market: DecibelMarket | null }> = ({ market }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleQuery = async (question: string) => {
        if (!market) return;
        setIsLoading(true);
        setResponse(null);
        setError(null);
        try {
            const analysis = await analyzeMarketWithAI(market.market_id, market, question);
            setResponse(analysis);
        } catch (err) {
            setError('Failed to get an analysis. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResponse(null);
        setError(null);
    };

    if (!market) return null;

    return (
        <Card className="p-4 bg-gradient-to-br from-gray-900/40 to-slate-900/60 border border-[#89F336]/30">
            <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                <BrainCircuitIcon className="w-5 h-5 text-[#f4ffb8]" />
                AI Market Analyst
            </h4>
            {isLoading ? (
                <div className="flex justify-center p-4"><Loader /></div>
            ) : error ? (
                <p className="text-red-400 text-xs text-center">{error}</p>
            ) : response ? (
                <div className="animate-fade-in-up">
                    <p className="text-gray-300 text-xs leading-relaxed border-l-2 border-[#f4ffb8] pl-3">{response}</p>
                    <button onClick={handleReset} className="text-xs font-semibold text-[#f4ffb8] mt-3 hover:text-[#f4ffb8] transition-colors">Ask another question</button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleQuery("Analyze the 24h volume and price trend.")} className="p-2 text-left bg-[#89F336]/10 border border-[#89F336]/30 rounded hover:bg-[#89F336]/20 transition-all text-xs text-[#89F336]">
                        Analyze Trend
                    </button>
                    <button onClick={() => handleQuery("Is the market volatility high or low right now?")} className="p-2 text-left bg-[#89F336]/10 border border-[#89F336]/30 rounded hover:bg-[#89F336]/20 transition-all text-xs text-[#89F336]">
                        Volatility Check
                    </button>
                    <button onClick={() => handleQuery("What are the key support and resistance levels based on high/low?")} className="p-2 text-left bg-[#89F336]/10 border border-[#89F336]/30 rounded hover:bg-[#89F336]/20 transition-all text-xs text-[#89F336] col-span-2">
                        Key Levels
                    </button>
                </div>
            )}
        </Card>
    );
};

interface DecibelMarketsProps {
    theme: 'light' | 'dark';
}

export const DecibelMarkets: React.FC<DecibelMarketsProps> = ({ theme }) => {
    const [markets, setMarkets] = useState<DecibelMarket[]>([]);
    const [activeMarket, setActiveMarket] = useState<DecibelMarket | null>(null);
    const [orderBook, setOrderBook] = useState<DecibelOrderBook | null>(null);
    const [trades, setTrades] = useState<DecibelTrade[]>([]);
    
    const [isMarketsLoading, setIsMarketsLoading] = useState(true);
    const [isOrderBookLoading, setIsOrderBookLoading] = useState(false);
    const [isTradesLoading, setIsTradesLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'buy' | 'sell' | null>(null);

    // Initial Load of Markets
    useEffect(() => {
        const loadMarkets = async () => {
            try {
                setIsMarketsLoading(true);
                const data = await DecibelService.getMarkets();
                setMarkets(data);
                if (data.length > 0) {
                    setActiveMarket(data[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsMarketsLoading(false);
            }
        };
        loadMarkets();
    }, []);

    // Load Orderbook and Trades when active market changes
    useEffect(() => {
        if (!activeMarket) return;
        
        const loadOrderBook = async () => {
            try {
                const data = await DecibelService.getOrderBook(activeMarket.market_id);
                setOrderBook(data);
            } catch (err) {
                console.error("Orderbook Error:", err);
            } finally {
                setIsOrderBookLoading(false);
            }
        };

        const loadTrades = async () => {
            try {
                const data = await DecibelService.getRecentTrades(activeMarket.market_id);
                setTrades(data);
            } catch (err) {
                console.error("Trades Error:", err);
            } finally {
                setIsTradesLoading(false);
            }
        };

        // Set loading states for initial fetch
        setIsOrderBookLoading(true);
        setIsTradesLoading(true);
        
        loadOrderBook();
        loadTrades();

        // Poll every 5 seconds for updates
        const interval = setInterval(() => {
            loadOrderBook();
            loadTrades();
        }, 5000);
        
        return () => clearInterval(interval);
    }, [activeMarket]);

    const handleActionClick = (action: 'buy' | 'sell') => {
        setModalAction(action);
        setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setModalAction(null), 300);
    };

    if (!activeMarket && !isMarketsLoading) return <div className="p-10 text-center">Failed to load Decibel markets.</div>;

    const tradingViewSymbol = activeMarket ? getTradingViewSymbol(activeMarket.market_id) : 'BINANCE:BTCUSDT';

    return (
        <>
            <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto">
                {/* Top Section: Chart & Order Book */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[450px]">
                    {/* Chart (Takes 3/4 space on large screens) */}
                    <div className="lg:col-span-3 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-[#89F336]/50 rounded-xl overflow-hidden relative shadow-xl">
                        <TradingViewChart symbol={tradingViewSymbol} theme={theme} interval="15" allowSymbolChange={false} />
                        {/* Overlay Market Info */}
                        <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-gray-700/50 flex gap-4 shadow-lg">
                            <div>
                                <div className="text-white font-bold text-lg">{activeMarket?.market_id}</div>
                                <div className="text-[#f4ffb8] text-sm font-mono">${activeMarket?.price.toLocaleString()}</div>
                            </div>
                            <div className="text-right border-l border-gray-700 pl-4">
                                <div className="text-gray-400 text-xs uppercase">24h Vol</div>
                                <div className="text-white text-sm font-mono">${(activeMarket?.volume_24h ?? 0 / 1000000).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Order Book (Takes 1/4 space) */}
                    <div className="hidden lg:block h-full">
                        <OrderBookPanel orderBook={orderBook} isLoading={isOrderBookLoading} />
                    </div>
                </div>

                {/* Bottom Section: Actions, AI, Trades & Market List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <ActionButton icon={<PlusCircleIcon className="w-5 h-5" />} label="Long / Buy" onClick={() => handleActionClick('buy')} colorClass="bg-[#f4ffb8] hover:bg-[#f4ffb8] !text-black" />
                            <ActionButton icon={<MinusCircleIcon className="w-5 h-5" />} label="Short / Sell" onClick={() => handleActionClick('sell')} colorClass="bg-red-600 hover:bg-red-500" />
                        </div>
                        
                        {/* NEW: AI Analyst */}
                        <DecibelAskAI market={activeMarket} />

                        {/* Recent Trades */}
                        <div className="flex-grow">
                            <RecentTradesList trades={trades} isLoading={isTradesLoading} />
                        </div>
                    </div>

                    {/* Market List */}
                    <div className="h-full">
                        <MarketList
                            markets={markets}
                            isLoading={isMarketsLoading}
                            activeMarketId={activeMarket?.market_id || ''}
                            onSelect={setActiveMarket}
                        />
                    </div>
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
