import React, { useState, useEffect } from 'react';
import type { PriceAlert } from '../types';
import { Card, Modal } from './UI';
import { BellIcon, ChevronDownIcon, PlusCircleIcon, TrashIcon, TrendingDownIcon, TrendingUpIcon } from './Icons';
import { SEPOLIA_ERC20_METADATA } from '../constants';
import type { MarketData } from '../services/marketService';

interface SimplifiedToken {
    symbol: string;
    name: string;
    logo: string;
    price: number;
}

const TokenSelector: React.FC<{ tokens: SimplifiedToken[], selectedToken: SimplifiedToken, onSelect: (token: SimplifiedToken) => void }> = ({ tokens, selectedToken, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (token: SimplifiedToken) => {
        onSelect(token);
        setIsOpen(false);
    }
    
    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Cryptocurrency</label>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-900/80 p-2 rounded-md border border-gray-300 dark:border-emerald-900/50 w-full text-left"
            >
                <img src={selectedToken.logo} alt={selectedToken.name} className="w-6 h-6 rounded-full" />
                <span className="font-semibold text-slate-800 dark:text-white">{selectedToken.symbol}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{selectedToken.name}</span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 dark:text-gray-400 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 top-full mt-1 w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-emerald-800 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {tokens.map(token => (
                        <button key={token.symbol} onClick={() => handleSelect(token)} className="w-full flex items-center gap-2 p-2 hover:bg-gray-300 dark:hover:bg-emerald-900/50">
                            <img src={token.logo} alt={token.name} className="w-6 h-6 rounded-full" />
                            <div className="text-left">
                                <span className="font-semibold text-slate-800 dark:text-white">{token.symbol}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 block">{token.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


const CreateAlertModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
    priceData: Record<string, MarketData>;
}> = ({ isOpen, onClose, onAddAlert, priceData }) => {
    
    const availableTokens: SimplifiedToken[] = SEPOLIA_ERC20_METADATA.map(t => ({
        symbol: t.symbol,
        name: t.name,
        logo: t.logo,
        price: priceData[t.symbol]?.price ?? t.mockPrice,
    }));

    const [selectedToken, setSelectedToken] = useState<SimplifiedToken>(availableTokens[0]);
    const [targetPrice, setTargetPrice] = useState('');
    const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

    useEffect(() => {
        if (selectedToken) {
            const livePrice = availableTokens.find(t => t.symbol === selectedToken.symbol)?.price;
            setTargetPrice(livePrice ? livePrice.toString() : '');
        }
    }, [selectedToken, availableTokens]);

    const handleSubmit = () => {
        const price = parseFloat(targetPrice);
        if (!price || price <= 0) return;

        onAddAlert({
            tokenSymbol: selectedToken.symbol,
            tokenName: selectedToken.name,
            tokenLogo: selectedToken.logo,
            condition,
            targetPrice: price,
        });
        onClose();
        // Reset form for next time
        setTargetPrice('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Price Alert">
            <div className="space-y-4">
                <TokenSelector tokens={availableTokens} selectedToken={selectedToken} onSelect={setSelectedToken} />
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Notify me when price is</label>
                    <div className="grid grid-cols-2 gap-2 bg-gray-200 dark:bg-gray-800/50 p-1 rounded-md">
                        <button onClick={() => setCondition('ABOVE')} className={`py-2 font-semibold rounded transition-colors ${condition === 'ABOVE' ? 'bg-indigo-600 dark:bg-emerald-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-indigo-100/50 dark:hover:bg-emerald-900/50'}`}>Above</button>
                        <button onClick={() => setCondition('BELOW')} className={`py-2 font-semibold rounded transition-colors ${condition === 'BELOW' ? 'bg-indigo-600 dark:bg-emerald-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-indigo-100/50 dark:hover:bg-emerald-900/50'}`}>Below</button>
                    </div>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Target Price (USD)</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">$</span>
                        <input
                            id="price"
                            type="number"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                            placeholder="e.g., 70000"
                            className="w-full bg-gray-200 dark:bg-gray-800/70 border border-gray-300 dark:border-gray-600 rounded-md p-3 pl-7 text-slate-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-emerald-500 focus:border-indigo-500 dark:focus:border-emerald-500 transition-all"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current price: ~${selectedToken.price.toLocaleString()}</p>
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full mt-2 bg-indigo-600 dark:bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-500 dark:hover:bg-emerald-500 transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={!targetPrice || parseFloat(targetPrice) <= 0}
                >
                    Set Alert
                </button>
            </div>
        </Modal>
    );
};

const AlertItem: React.FC<{ alert: PriceAlert; onDelete: (id: string) => void; currentPrice: number | undefined; }> = ({ alert, onDelete, currentPrice }) => {
    return (
        <Card className="p-3">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                <img src={alert.tokenLogo} alt={alert.tokenName} className="w-10 h-10 rounded-full" />
                <div>
                    <div className="font-bold text-slate-800 dark:text-white">{alert.tokenSymbol}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        {alert.condition === 'ABOVE' ? <TrendingUpIcon className="w-4 h-4 text-emerald-500" /> : <TrendingDownIcon className="w-4 h-4 text-red-500" />}
                        <span>{alert.condition === 'ABOVE' ? 'Above' : 'Below'} ${alert.targetPrice.toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Current Price</div>
                        <div className="font-mono text-slate-800 dark:text-white">${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? '...'}</div>
                    </div>
                    <button onClick={() => onDelete(alert.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-200/50 dark:hover:bg-red-900/50 rounded-full transition-colors">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Card>
    );
};

export const Alerts: React.FC<{ priceData: Record<string, MarketData> }> = ({ priceData }) => {
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedAlerts = localStorage.getItem('priceAlerts');
        if (storedAlerts) {
            setAlerts(JSON.parse(storedAlerts));
        }
        
        // Listen for storage changes to update UI if a notification triggers in the background
        const handleStorageChange = () => {
            const updatedAlerts = localStorage.getItem('priceAlerts');
            setAlerts(updatedAlerts ? JSON.parse(updatedAlerts) : []);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, []);

    const updateAlerts = (updatedAlerts: PriceAlert[]) => {
        setAlerts(updatedAlerts);
        localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
        // Manually dispatch a storage event so other tabs would update (good practice)
        window.dispatchEvent(new Event('storage'));
    };
    
    const addAlert = (newAlert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
        const alertWithId: PriceAlert = {
            ...newAlert,
            id: `alert-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        updateAlerts([...alerts, alertWithId]);
    };

    const deleteAlert = (id: string) => {
        updateAlerts(alerts.filter(alert => alert.id !== id));
    };
    
    return (
        <>
            <div className="p-4 h-full flex flex-col">
                <div className="mb-4 animate-fade-in-up">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 dark:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-500 dark:hover:bg-emerald-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    >
                        <PlusCircleIcon className="w-6 h-6" />
                        <span>Create New Alert</span>
                    </button>
                </div>

                <div className="flex-grow bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-emerald-900/50 rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="h-full overflow-y-auto p-4">
                        {alerts.length > 0 ? (
                             <div className="space-y-3">
                                {alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((alert, index) => (
                                    <div key={alert.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms`}}>
                                        <AlertItem alert={alert} onDelete={deleteAlert} currentPrice={priceData[alert.tokenSymbol]?.price} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center text-gray-500 p-10 flex flex-col items-center">
                                <BellIcon className="w-12 h-12 mb-4" />
                                <h3 className="font-semibold text-slate-800 dark:text-white">No Active Alerts</h3>
                                <p className="text-sm">Create an alert to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CreateAlertModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddAlert={addAlert}
                priceData={priceData}
            />
        </>
    );
};