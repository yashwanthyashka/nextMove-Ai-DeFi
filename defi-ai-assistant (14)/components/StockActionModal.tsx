import React, { useState } from 'react';
import { Modal } from './UI';
import { MOCK_STOCK_PORTFOLIO } from '../constants';
import type { Stock } from '../types';
import { ChevronDownIcon } from './Icons';

interface StockActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: 'buy' | 'sell';
}

const StockSelector: React.FC<{ stocks: Stock[], selectedStock: Stock, onSelect: (stock: Stock) => void }> = ({ stocks, selectedStock, onSelect }) => {
    // In a real app, this would be a dropdown menu
    return (
        <button className="flex items-center gap-2 bg-gray-900/80 p-2 rounded-md border border-[#f4ffb8]/50 w-full text-left">
            <img src={selectedStock.logo} alt={selectedStock.name} className="w-6 h-6 rounded-full bg-white" />
            <span className="font-semibold text-white">{selectedStock.symbol.split(':')[1]}</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 ml-auto" />
        </button>
    );
}

const FormInput: React.FC<{ label: string, placeholder: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, children?: React.ReactNode }> = ({ label, placeholder, type = 'text', value, onChange, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="relative">
            <input 
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled // Disabled for demo
                className="w-full bg-gray-800/70 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#f4ffb8] focus:border-[#f4ffb8] transition-all disabled:opacity-60"
            />
            {children && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{children}</div>}
        </div>
    </div>
);

const BuySellForm: React.FC<{ action: 'buy' | 'sell' }> = ({ action }) => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>(action);
    const availableStocks = [ ...MOCK_STOCK_PORTFOLIO.holdings, { symbol: 'NASDAQ:GOOGL', name: 'Alphabet Inc.', shares: 0, price: 140, logo: 'https://companieslogo.com/img/orig/GOOG-05b08511.png?t=1633216834'} ];
    const [selectedStock, setSelectedStock] = useState(availableStocks[0]);
    
    return (
        <div>
            <div className="bg-gray-800/50 p-1 rounded-md flex mb-4">
                <button onClick={() => setActiveTab('buy')} className={`w-full py-2 font-semibold rounded transition-colors ${activeTab === 'buy' ? 'bg-[#f4ffb8] text-black' : 'text-gray-400 hover:bg-[#f4ffb8]/50'}`}>Buy</button>
                <button onClick={() => setActiveTab('sell')} className={`w-full py-2 font-semibold rounded transition-colors ${activeTab === 'sell' ? 'bg-[#f4ffb8] text-black' : 'text-gray-400 hover:bg-[#f4ffb8]/50'}`}>Sell</button>
            </div>
            <div className="space-y-4">
                 <FormInput label="Amount" placeholder="0.00" type="number" value="" onChange={() => {}} >
                     <span className="text-gray-400 text-sm font-semibold pr-2">USD</span>
                </FormInput>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Asset</label>
                  <StockSelector stocks={availableStocks} selectedStock={selectedStock} onSelect={setSelectedStock} />
                </div>
            </div>
             <p className="text-sm text-center text-gray-500 mt-6">
                Full trading functionality is coming soon.
            </p>
            <button disabled className="w-full mt-2 bg-[#f4ffb8] text-black font-semibold py-3 rounded-lg hover:bg-[#f4ffb8] transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100">
                Confirm {activeTab === 'buy' ? 'Purchase' : 'Sale'}
            </button>
        </div>
    );
};

export const StockActionModal: React.FC<StockActionModalProps> = ({ isOpen, onClose, action }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Buy / Sell Stocks">
            <BuySellForm action={action} />
        </Modal>
    );
};
