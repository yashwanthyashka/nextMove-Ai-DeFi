
import React, { useState, useEffect } from 'react';
import { Card, Loader, Modal } from './UI';
import { 
    RocketIcon, InfoIcon, SearchIcon, PlusCircleIcon, 
    FireIcon, ChartBarIcon, CheckCircleIcon, CopyIcon, 
    ArrowsRightLeftIcon, ActivityIcon, PhotoIcon, AptosIcon, XMarkIcon,
    SettingsIcon, GlobeAltIcon, SendIcon
} from './Icons';
import { AptosLaunchService } from '../services/aptosLaunchService';
import type { LaunchToken } from '../types';
import { TradingViewChart } from './TradingViewChart';

// --- Helper Components ---

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mt-2 relative group border border-[#f4ffb8]/20">
        <div 
            className={`h-full transition-all duration-500 ease-out ${
                value >= 90 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' : 'bg-[#f4ffb8]'
            }`} 
            style={{ width: `${value}%` }} 
        />
        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-black drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            {value.toFixed(1)}% to Raydium (DEX)
        </div>
    </div>
);

const TokenCard: React.FC<{ token: LaunchToken; onClick: () => void }> = ({ token, onClick }) => (
    <button onClick={onClick} className="text-left w-full h-full">
        <Card className="h-full p-3 hover:border-[#f4ffb8]/50 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-slate-900/60 flex flex-col group border border-gray-800">
            {/* Header */}
            <div className="flex gap-3 mb-3">
                <div className="relative w-16 h-16 flex-shrink-0">
                    <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover rounded-lg border border-gray-700" />
                    {token.isDoxxed && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-slate-900" title="Doxxed Creator">
                            <CheckCircleIcon className="w-3 h-3" />
                        </div>
                    )}
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{token.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-[#f4ffb8] font-mono">
                        <span>{token.symbol}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400">MC: ${token.marketCap.toLocaleString()}</span>
                    </div>
                    <div className="mt-1 flex gap-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${token.category === 'Meme' ? 'border-pink-500/30 text-pink-400 bg-pink-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                            {token.category}
                        </span>
                        {token.bondingCurveProgress === 100 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded border border-yellow-500/30 text-yellow-400 bg-yellow-500/10">
                                Live
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-grow">{token.description}</p>

            {/* Bonding Curve Status */}
            <div className="mt-auto">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Bonding Curve</span>
                    <span className={token.bondingCurveProgress > 80 ? 'text-orange-400 font-bold' : ''}>
                        {token.bondingCurveProgress.toFixed(0)}%
                    </span>
                </div>
                <ProgressBar value={token.bondingCurveProgress} />
            </div>
        </Card>
    </button>
);

const TradePanel: React.FC<{ token: LaunchToken; onClose: () => void }> = ({ token, onClose }) => {
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState<'buy' | 'sell'>('buy');
    const [isTrading, setIsTrading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'chart' | 'tokenomics'>('chart');
    const [error, setError] = useState<string | null>(null);

    // Mock live price updates
    const [price, setPrice] = useState(token.price);
    
    const [chartSymbol] = useState(() => {
        const s = token.symbol.toUpperCase();
        if (s === 'APT') return 'BINANCE:APTUSDT';
        if (s === 'THL') return 'MEXC:THLUSDT'; 
        if (s === 'GUI') return 'MEXC:GUIUSDT'; 
        return 'BINANCE:APTUSDT';
    });

    const handleTrade = async () => {
        if (!amount) return;
        setIsTrading(true);
        setError(null);
        try {
            const res = await AptosLaunchService.tradeToken(token.id, parseFloat(amount), mode);
            setPrice(res.newPrice > 0 ? res.newPrice : price); // Keep price if not returned
            setTxHash(res.txHash);
            setAmount('');
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Transaction failed");
        } finally {
            setIsTrading(false);
        }
    };

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopyFeedback(label);
        setTimeout(() => setCopyFeedback(null), 2000);
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col animate-fade-in-up overflow-y-auto">
            {/* Nav */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-slate-900/50 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-white">
                        <ArrowsRightLeftIcon className="w-5 h-5 rotate-180" /> {/* Back Icon hack */}
                    </button>
                    <img src={token.imageUrl} className="w-8 h-8 rounded-full" />
                    <div>
                        <h2 className="font-bold text-white leading-tight">{token.name}</h2>
                        <p className="text-xs text-[#f4ffb8] font-mono">${price.toFixed(8)}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase">Market Cap</p>
                    <p className="text-sm font-bold text-white">${token.marketCap.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex-grow p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
                
                {/* Left: Chart / Tokenomics */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => setActiveTab('chart')} 
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'chart' ? 'bg-[#f4ffb8] text-black' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
                        >
                            Live Chart
                        </button>
                        <button 
                            onClick={() => setActiveTab('tokenomics')} 
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'tokenomics' ? 'bg-[#f4ffb8] text-black' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
                        >
                            Tokenomics & Supply
                        </button>
                    </div>

                    <div className="bg-slate-900/50 border border-[#f4ffb8]/30 rounded-xl overflow-hidden h-[400px] lg:h-[500px]">
                        {activeTab === 'chart' ? (
                            <TradingViewChart symbol={chartSymbol} theme="dark" interval="15" allowSymbolChange={false} />
                        ) : (
                            <div className="p-6 text-white h-full overflow-y-auto">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <ChartBarIcon className="w-6 h-6 text-[#f4ffb8]" /> Supply Chain Management
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Supply Distribution */}
                                    <div className="bg-black/30 p-4 rounded-xl border border-gray-700">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Supply Distribution</h4>
                                        <div className="flex h-6 rounded-full overflow-hidden mb-2">
                                            <div style={{ width: `${token.distribution?.liquidity || 90}%` }} className="bg-[#f4ffb8]" title="Liquidity Pool"></div>
                                            <div style={{ width: `${token.distribution?.creator || 10}%` }} className="bg-blue-500" title="Creator/Team"></div>
                                            <div style={{ width: `${token.distribution?.community || 0}%` }} className="bg-purple-500" title="Community/Airdrop"></div>
                                        </div>
                                        <div className="flex justify-between text-xs mt-2">
                                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#f4ffb8] rounded-full"></div> Liquidity Pool ({token.distribution?.liquidity}%)</div>
                                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Creator ({token.distribution?.creator}%)</div>
                                            {token.distribution?.community ? <div className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Community ({token.distribution?.community}%)</div> : null}
                                        </div>
                                    </div>

                                    {/* Tax Settings */}
                                    <div className="bg-black/30 p-4 rounded-xl border border-gray-700">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Configured Taxes</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Buy Tax</span>
                                                <span className="font-mono font-bold text-[#f4ffb8]">{token.taxes?.buy}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-800 rounded-full"><div style={{ width: `${(token.taxes?.buy || 0) * 10}%` }} className="h-full bg-[#f4ffb8] rounded-full"></div></div>
                                            
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-gray-300">Sell Tax</span>
                                                <span className="font-mono font-bold text-red-400">{token.taxes?.sell}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-800 rounded-full"><div style={{ width: `${(token.taxes?.sell || 0) * 10}%` }} className="h-full bg-red-500 rounded-full"></div></div>
                                        </div>
                                    </div>
                                    
                                    {/* Socials */}
                                    <div className="bg-black/30 p-4 rounded-xl border border-gray-700 md:col-span-2">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Official Links</h4>
                                        <div className="flex gap-4">
                                            {token.socials?.website && (
                                                <a href={token.socials.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                                    <GlobeAltIcon className="w-4 h-4 text-blue-400" /> Website
                                                </a>
                                            )}
                                            {token.socials?.twitter && (
                                                <a href={token.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                                    <span className="font-bold text-sky-400">X</span> Twitter
                                                </a>
                                            )}
                                            {token.socials?.telegram && (
                                                <a href={token.socials.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                                    <SendIcon className="w-4 h-4 text-sky-500" /> Telegram
                                                </a>
                                            )}
                                            {!token.socials?.website && !token.socials?.twitter && !token.socials?.telegram && (
                                                <span className="text-gray-500 italic">No social links provided by creator.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Token Info Card */}
                    <div className="bg-slate-900/50 border border-[#f4ffb8]/30 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">About {token.name}</h3>
                                <div className="flex gap-2">
                                    {token.isDoxxed && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">Doxxed Dev</span>}
                                    <span className="text-[10px] bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded">{token.category}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Created</p>
                                <p className="text-xs text-gray-300">{new Date(token.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">{token.description}</p>
                        
                        {/* Bot Info Section */}
                        <div className="bg-black/30 rounded-lg p-3 border border-gray-700">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                <InfoIcon className="w-3 h-3" /> Bot Integration (Metadata)
                            </h4>
                            <div className="grid gap-2 text-xs">
                                <div className="flex justify-between items-center group">
                                    <span className="text-gray-500">Token Type Arg:</span>
                                    <button onClick={() => handleCopy(token.tokenObjectAddress, 'Token')} className="flex items-center gap-2 text-[#f4ffb8] hover:text-white font-mono bg-[#f4ffb8]/20 px-2 py-1 rounded border border-[#f4ffb8]/50 transition-colors max-w-[200px] sm:max-w-md truncate">
                                        <span className="truncate">{token.tokenObjectAddress}</span>
                                        {copyFeedback === 'Token' ? <CheckCircleIcon className="w-3 h-3 flex-shrink-0" /> : <CopyIcon className="w-3 h-3 flex-shrink-0" />}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-gray-500">Creator/LP:</span>
                                    <button onClick={() => handleCopy(token.lpAddress, 'LP')} className="flex items-center gap-2 text-blue-400 hover:text-white font-mono bg-blue-900/20 px-2 py-1 rounded border border-blue-900/50 transition-colors max-w-[200px] sm:max-w-md truncate">
                                        <span className="truncate">{token.lpAddress}</span>
                                        {copyFeedback === 'LP' ? <CheckCircleIcon className="w-3 h-3 flex-shrink-0" /> : <CopyIcon className="w-3 h-3 flex-shrink-0" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Trade & Bonding Curve */}
                <div className="space-y-4">
                    {/* Bonding Curve Progress */}
                    <Card className="p-4 bg-gradient-to-b from-slate-900 to-black border-[#f4ffb8]/50">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <RocketIcon className="w-4 h-4 text-orange-500" />
                            Bonding Curve Progress
                        </h3>
                        <ProgressBar value={token.bondingCurveProgress} />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {token.bondingCurveProgress === 100 
                                ? "Graduated to Raydium/PancakeSwap! Trading is live on DEX."
                                : "When the market cap reaches ~450k APT, all liquidity is deposited into DEX and burned."}
                        </p>
                    </Card>

                    {/* Trade Box */}
                    <Card className="p-4 bg-slate-800/50 border-[#f4ffb8]/20">
                        <div className="flex bg-black/40 p-1 rounded-lg mb-4">
                            <button 
                                onClick={() => setMode('buy')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'buy' ? 'bg-[#f4ffb8] text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                Buy
                            </button>
                            <button 
                                onClick={() => setMode('sell')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'sell' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Sell
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Amount (APT)</span>
                                <span>Bal: 12.5 APT</span>
                            </div>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.0"
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg py-3 px-4 text-white font-mono focus:border-[#f4ffb8] focus:outline-none"
                                />
                                <span className="absolute right-3 top-3 text-sm text-gray-500 font-bold">APT</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-2 bg-red-900/30 border border-red-500/30 rounded text-center">
                                <p className="text-xs text-red-400">{error}</p>
                            </div>
                        )}

                        {txHash && (
                            <div className="mb-4 p-2 bg-[#f4ffb8]/20 border border-[#f4ffb8]/50 rounded text-center break-all">
                                <p className="text-xs text-[#f4ffb8] font-bold mb-1">Transaction Confirmed!</p>
                                <a href={`https://explorer.aptoslabs.com/txn/${txHash}?network=mainnet`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#f4ffb8] hover:underline font-mono">
                                    {txHash}
                                </a>
                            </div>
                        )}

                        <button 
                            onClick={handleTrade}
                            disabled={!amount || isTrading}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'buy' ? 'bg-[#f4ffb8] !text-black hover:bg-[#f4ffb8]' : 'bg-red-500 hover:bg-red-400'}`}
                        >
                            {isTrading ? <Loader /> : `${mode.toUpperCase()} ${token.symbol}`}
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InstallWalletModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Connect Wallet">
            <div className="text-center space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
                    <p className="text-orange-300 text-sm">No Aptos wallet detected.</p>
                </div>
                <p className="text-gray-300">To launch tokens and interact with the Aptos blockchain, you need an Aptos-compatible wallet installed.</p>
                <div className="grid grid-cols-2 gap-4">
                    <a href="https://petra.app/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
                        <span className="font-bold text-white mb-1">Petra Wallet</span>
                        <span className="text-xs text-gray-400">By Aptos Labs</span>
                    </a>
                    <a href="https://martianwallet.xyz/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
                        <span className="font-bold text-white mb-1">Martian Wallet</span>
                        <span className="text-xs text-gray-400">Community Favorite</span>
                    </a>
                </div>
                <button onClick={onClose} className="mt-4 text-gray-500 hover:text-white text-sm">Close</button>
            </div>
        </Modal>
    );
}

// --- Main Component ---

export const Launchpad: React.FC = () => {
    const [view, setView] = useState<'browse' | 'create'>('browse');
    const [tokens, setTokens] = useState<LaunchToken[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'meme' | 'utility'>('all');
    const [selectedToken, setSelectedToken] = useState<LaunchToken | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    // Create Form State
    const [newName, setNewName] = useState('');
    const [newSymbol, setNewSymbol] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newImage, setNewImage] = useState(''); 
    const [newCategory, setNewCategory] = useState<'Meme' | 'Utility'>('Meme');
    
    // Advanced Settings State
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [initialSupply, setInitialSupply] = useState('1000000000');
    const [decimals, setDecimals] = useState('8');
    const [buyTax, setBuyTax] = useState(0);
    const [sellTax, setSellTax] = useState(0);
    const [website, setWebsite] = useState('');
    const [twitter, setTwitter] = useState('');
    const [telegram, setTelegram] = useState('');

    const [isCreating, setIsCreating] = useState(false);
    const [creationStep, setCreationStep] = useState<string>('');
    const [createError, setCreateError] = useState<string | null>(null);

    // Check for wallet on mount
    useEffect(() => {
        const checkWallet = async () => {
            const addr = await AptosLaunchService.getAccount();
            if (addr) setWalletAddress(addr);
        }
        checkWallet();
    }, []);

    useEffect(() => {
        loadTokens();
    }, [filter]);

    const connectWallet = async () => {
        // First check if user actually has a wallet
        if (!AptosLaunchService.hasWallet()) {
            setIsWalletModalOpen(true);
            return;
        }

        const addr = await AptosLaunchService.connectWallet();
        if (addr) {
            setWalletAddress(addr);
        } else {
            // Connection failed or rejected. 
            // We do NOT open the Install Modal here to avoid annoying users who simply cancelled the prompt.
            console.warn("Wallet connection failed or was rejected.");
        }
    }

    const loadTokens = async () => {
        setLoading(true);
        const data = await AptosLaunchService.getTokens(filter);
        setTokens(data);
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!newName || !newSymbol || !newDesc) return;
        setIsCreating(true);
        setCreateError(null);
        
        let currentAddr = walletAddress;
        if (!currentAddr) {
            // Attempt to connect if not already connected
            if (!AptosLaunchService.hasWallet()) {
                setIsWalletModalOpen(true);
                setIsCreating(false);
                return;
            }
            
            const addr = await AptosLaunchService.connectWallet();
            if (addr) {
                setWalletAddress(addr);
                currentAddr = addr;
            } else {
                setIsCreating(false);
                return;
            }
        }

        try {
            setCreationStep('Confirm Transaction in Wallet...');
            
            const result = await AptosLaunchService.createToken({
                name: newName,
                symbol: newSymbol,
                description: newDesc,
                imageUrl: newImage || 'https://cdn-icons-png.flaticon.com/512/10609/10609398.png', 
                category: newCategory,
                isDoxxed: !!currentAddr,
                initialSupply: parseFloat(initialSupply),
                decimals: parseInt(decimals),
                taxes: { buy: buyTax, sell: sellTax },
                socials: { website, twitter, telegram }
            });
            
            setCreationStep('Waiting for Block Confirmation...');
            
            // Wait for indexing (visual delay for UX)
            await new Promise(r => setTimeout(r, 1000));

            setView('browse');
            setSelectedToken(result.token); 
            
            // Optimistically update list
            setTokens(prev => [result.token, ...prev]);
            
            // Reset form
            setNewName(''); setNewSymbol(''); setNewDesc(''); setShowAdvanced(false);
        } catch (e: any) {
            console.error(e);
            setCreateError(e.message || "Failed to create token. Please check wallet.");
        } finally {
            setIsCreating(false);
            setCreationStep('');
        }
    };

    return (
        <div className="h-full flex flex-col relative">
            <InstallWalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
            
            {/* Header / Nav */}
            <div className="flex-shrink-0 p-4 flex items-center justify-between border-b border-gray-800 bg-slate-900/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                    <RocketIcon className="w-6 h-6 text-[#f4ffb8]" />
                    <h1 className="text-xl font-bold text-white tracking-tight">Aptos Launch</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <button 
                        onClick={walletAddress ? () => {} : connectWallet}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${walletAddress ? 'bg-[#f4ffb8]/20 border-[#f4ffb8]/50 text-[#f4ffb8]' : 'bg-white text-black border-white hover:bg-gray-200'}`}
                    >
                        <AptosIcon className="w-4 h-4" />
                        {walletAddress ? `${walletAddress.substring(0, 6)}...` : 'Connect Wallet'}
                    </button>

                    <div className="flex bg-black/40 rounded-lg p-1">
                        <button 
                            onClick={() => setView('browse')} 
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'browse' ? 'bg-[#f4ffb8] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Terminal
                        </button>
                        <button 
                            onClick={() => setView('create')} 
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'create' ? 'bg-[#f4ffb8] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Launch
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-4 pb-24">
                
                {/* CREATE VIEW */}
                {view === 'create' && (
                    <div className="max-w-xl mx-auto animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Launch your token</h2>
                            <p className="text-gray-400 text-sm">No code required. Instant liquidity via bonding curve.</p>
                        </div>

                        <Card className="p-6 bg-slate-900/80 border-[#f4ffb8]/50">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f4ffb8] focus:outline-none" placeholder="e.g. Moon Cat" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ticker</label>
                                    <input type="text" value={newSymbol} onChange={e => setNewSymbol(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f4ffb8] focus:outline-none" placeholder="e.g. MCAT" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f4ffb8] focus:outline-none h-24" placeholder="Describe your project..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL (Optional)</label>
                                    <input type="text" value={newImage} onChange={e => setNewImage(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f4ffb8] focus:outline-none" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setNewCategory('Meme')} className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${newCategory === 'Meme' ? 'bg-pink-500/20 border-pink-500 text-white' : 'bg-transparent border-gray-700 text-gray-500'}`}>
                                            <FireIcon className="w-6 h-6" />
                                            <span className="font-bold">Meme</span>
                                        </button>
                                        <button onClick={() => setNewCategory('Utility')} className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${newCategory === 'Utility' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-transparent border-gray-700 text-gray-500'}`}>
                                            <ChartBarIcon className="w-6 h-6" />
                                            <span className="font-bold">Utility</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Advanced Settings Toggle */}
                                <button 
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    <SettingsIcon className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                                    Advanced Settings (Supply, Tax, Socials)
                                </button>

                                {showAdvanced && (
                                    <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-gray-700/50 animate-fade-in-up">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Supply</label>
                                                <input type="number" value={initialSupply} onChange={e => setInitialSupply(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white focus:border-[#f4ffb8] focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Decimals</label>
                                                <input type="number" value={decimals} onChange={e => setDecimals(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white focus:border-[#f4ffb8] focus:outline-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Transaction Tax (0-10%)</label>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-xs text-gray-400">
                                                    <span>Buy Tax: {buyTax}%</span>
                                                    <input type="range" min="0" max="10" value={buyTax} onChange={e => setBuyTax(parseInt(e.target.value))} className="w-2/3 accent-[#f4ffb8]" />
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-gray-400">
                                                    <span>Sell Tax: {sellTax}%</span>
                                                    <input type="range" min="0" max="10" value={sellTax} onChange={e => setSellTax(parseInt(e.target.value))} className="w-2/3 accent-red-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Social Links (For Bots)</label>
                                            <input type="text" value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website URL" className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-xs text-white focus:border-[#f4ffb8] focus:outline-none" />
                                            <input type="text" value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="Twitter/X URL" className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-xs text-white focus:border-[#f4ffb8] focus:outline-none" />
                                            <input type="text" value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="Telegram Link" className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-xs text-white focus:border-[#f4ffb8] focus:outline-none" />
                                        </div>
                                    </div>
                                )}

                                {createError && (
                                    <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-xs">
                                        {createError}
                                    </div>
                                )}

                                <button 
                                    onClick={handleCreate} 
                                    disabled={!newName || !newSymbol || isCreating}
                                    className="w-full mt-4 bg-[#f4ffb8] text-black font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:bg-[#f4ffb8]"
                                >
                                    {isCreating ? <><Loader /> {creationStep}</> : (
                                        <>
                                            {walletAddress ? 'Launch on Mainnet (0.01 APT)' : 'Connect Wallet to Launch'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* BROWSE VIEW */}
                {view === 'browse' && (
                    <>
                        {/* Featured Live Tokens */}
                        {tokens.length > 0 && (
                            <div className="mb-8 animate-fade-in-up">
                                <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                    Live on Aptos Mainnet
                                </h3>
                                <div onClick={() => setSelectedToken(tokens[0])} className="cursor-pointer">
                                    <Card className="bg-gradient-to-r from-yellow-900/40 to-black border-yellow-500/30 p-4 flex items-center gap-6 hover:scale-[1.01] transition-transform">
                                        <img src={tokens[0].imageUrl} className="w-24 h-24 rounded-xl shadow-lg shadow-yellow-900/50 object-cover" />
                                        <div className="flex-grow">
                                            <h2 className="text-2xl font-bold text-white mb-1">{tokens[0].name} <span className="text-yellow-500 text-lg">(${tokens[0].symbol})</span></h2>
                                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{tokens[0].description}</p>
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase">Market Cap</p>
                                                    <p className="text-lg font-mono text-[#f4ffb8] font-bold">${tokens[0].marketCap.toLocaleString()}</p>
                                                </div>
                                                <div className="flex-grow max-w-xs">
                                                    <p className="text-[10px] text-gray-500 uppercase mb-1">Status</p>
                                                    <div className="text-xs font-bold text-white bg-[#f4ffb8]/20 px-2 py-0.5 rounded border border-[#f4ffb8]/30 inline-block">
                                                        Tradable on DEX
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* Filters */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                            {(['all', 'meme', 'utility'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${filter === f ? 'bg-[#f4ffb8] text-black' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
                                >
                                    {f}
                                </button>
                            ))}
                            <div className="flex-grow"></div>
                            <div className="relative">
                                <SearchIcon className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                                <input type="text" placeholder="Search tokens" className="bg-slate-900 border border-gray-700 rounded-full py-2 pl-9 pr-4 text-xs text-white focus:border-[#f4ffb8] focus:outline-none w-40" />
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="flex justify-center p-10"><Loader /></div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tokens.map((token, i) => (
                                    <div key={token.id} className="h-64 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                        <TokenCard token={token} onClick={() => setSelectedToken(token)} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Trade Panel Overlay */}
            {selectedToken && (
                <TradePanel token={selectedToken} onClose={() => setSelectedToken(null)} />
            )}
        </div>
    );
};
