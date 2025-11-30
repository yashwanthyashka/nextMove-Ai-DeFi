
import React from 'react';
import type { Transaction } from '../types';
import { Card, Loader } from './UI';
import { ArrowDownLeftIcon, ArrowUpRightIcon, MinusCircleIcon, PlusCircleIcon, RefreshCwIcon } from './Icons';

interface TransactionHistoryProps {
    transactions: Transaction[];
    isLoading: boolean;
    onRefresh: () => void;
}

const getStatusClass = (status: Transaction['status']) => {
    switch (status) {
        case 'Completed':
            return 'bg-[#f4ffb8]/20 text-[#f4ffb8]';
        case 'Pending':
            return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
        case 'Failed':
            return 'bg-red-500/20 text-red-500';
        default:
            return 'bg-gray-500/20 text-gray-500';
    }
};

const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
        case 'Buy':
            return <PlusCircleIcon className="w-6 h-6 text-[#f4ffb8]" />;
        case 'Sell':
            return <MinusCircleIcon className="w-6 h-6 text-red-500" />;
        case 'Send':
            return <ArrowUpRightIcon className="w-6 h-6 text-blue-500" />;
        case 'Receive':
            return <ArrowDownLeftIcon className="w-6 h-6 text-purple-500" />;
    }
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isPositive = transaction.type === 'Buy' || transaction.type === 'Receive';
    const date = new Date(transaction.date);

    return (
            <Card className="p-3 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 dark:hover:border-[#f4ffb8]/50">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-gray-200/60 dark:bg-gray-800/60 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                </div>

                {/* Info */}
                <div className="flex flex-col overflow-hidden">
                    <div className="font-bold text-slate-800 dark:text-white truncate">{transaction.type} {transaction.tokenSymbol}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                {/* Amounts & Status */}
                <div className="text-right flex flex-col items-end">
                    <div className={`font-semibold ${isPositive ? 'text-[#f4ffb8]' : 'text-slate-800 dark:text-white'}`}>
                        {isPositive ? '+' : '-'} {transaction.tokenAmount.toLocaleString()} {transaction.tokenSymbol}
                    </div>
                    {transaction.usdAmount > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            ${transaction.usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    )}
                     <div className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusClass(transaction.status)}`}>
                        {transaction.status}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, isLoading, onRefresh }) => {
    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex justify-end items-center mb-4 animate-fade-in-up">
                <button 
                    onClick={onRefresh} 
                    disabled={isLoading}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#f4ffb8] transition-colors disabled:opacity-50"
                    aria-label="Refresh transactions"
                >
                    <RefreshCwIcon className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

             <div className="flex-grow bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-[#f4ffb8]/50 rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="h-full overflow-y-auto p-4">
                    {isLoading && transactions.length === 0 ? (
                        <Loader />
                    ) : transactions.length > 0 ? (
                        <div className="space-y-3">
                            {transactions.map((tx, index) => (
                                <div key={tx.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`}}>
                                    <TransactionItem transaction={tx} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 p-10 animate-fade-in-up">No transactions found on the Sepolia network for this address.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
