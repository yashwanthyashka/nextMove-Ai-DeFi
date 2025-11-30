
import React, { useState, useCallback } from 'react';
import { Card, Loader } from './UI';
import { MOCK_DEFI_OPPORTUNITIES } from '../constants';
import type { DeFiOpportunity } from '../types';
import { ArrowUpRightIcon, BrainCircuitIcon, ChevronLeftIcon, GlobeAltIcon } from './Icons';
import { fetchDeFiExplanation } from '../services/geminiService';

const formatTVL = (tvl: number): string => {
    if (tvl >= 1_000_000_000) {
        return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
    }
    if (tvl >= 1_000_000) {
        return `$${(tvl / 1_000_000).toFixed(2)}M`;
    }
    return `$${tvl.toLocaleString()}`;
};

const OpportunityCard: React.FC<{
    opportunity: DeFiOpportunity;
    onSelect: (opp: DeFiOpportunity) => void;
}> = ({ opportunity, onSelect }) => {
    const title = `${opportunity.type} ${opportunity.tokenSymbol}`;
    
    return (
        <Card className="dark:hover:border-[#89F336]/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 group">
            <button onClick={() => onSelect(opportunity)} className="w-full text-left p-4">
                <div className="flex items-start gap-4">
                    <img src={opportunity.logo} alt={opportunity.protocol} className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{opportunity.protocol}</p>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-[#89F336] transition-colors">{title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {opportunity.tags.map(tag => (
                                <span key={tag} className="text-xs font-semibold px-2 py-0.5 bg-[#89F336]/20 text-[#89F336] rounded-full">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-[#89F336] filter drop-shadow-[0_0_5px_currentColor]">{opportunity.apy.toFixed(2)}%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">APY</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white mt-2">{formatTVL(opportunity.tvl)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">TVL</p>
                    </div>
                </div>
            </button>
        </Card>
    );
};

const AskAI: React.FC<{ protocolName: string }> = ({ protocolName }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleQuery = useCallback(async (question: string) => {
        setIsLoading(true);
        setResponse(null);
        setError(null);
        try {
            const explanation = await fetchDeFiExplanation(protocolName, question);
            setResponse(explanation);
        } catch (err) {
            setError('Failed to get an explanation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [protocolName]);

    const handleReset = () => {
        setResponse(null);
        setError(null);
    };

    const QuickQueryButton: React.FC<{ question: string }> = ({ question }) => (
        <button onClick={() => handleQuery(question)} className="w-full p-3 text-left bg-gray-200/50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors">
            {question}
        </button>
    );

    return (
        <Card className="p-4 bg-white/80 dark:bg-slate-900/40">
            <h4 className="flex items-center gap-2 text-md font-bold text-slate-800 dark:text-white mb-3">
                <BrainCircuitIcon className="w-5 h-5 text-[#89F336]" />
                Learn with AI
            </h4>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
            ) : response ? (
                <div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{response}</p>
                    <button onClick={handleReset} className="text-sm font-semibold text-[#89F336] mt-4">Ask another question</button>
                </div>
            ) : (
                <div className="space-y-2">
                    <QuickQueryButton question="What are the risks?" />
                    <QuickQueryButton question="How does this protocol make money?" />
                    <QuickQueryButton question={`Explain how to use ${protocolName} step-by-step.`} />
                </div>
            )}
        </Card>
    );
};

const OpportunityDetail: React.FC<{
    opportunity: DeFiOpportunity;
    onBack: () => void;
}> = ({ opportunity, onBack }) => {
    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {/* Header */}
            <div className="flex-shrink-0 p-4">
                 <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-colors">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <img src={opportunity.logo} alt={opportunity.protocol} className="w-10 h-10 rounded-full" />
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{opportunity.protocol}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{opportunity.type} {opportunity.tokenSymbol}</p>
                    </div>
                </div>
            </div>
            
            {/* Body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {/* Stats Card */}
                <Card className="p-4 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-3xl font-bold text-[#89F336] filter drop-shadow-[0_0_8px_currentColor]">{opportunity.apy.toFixed(2)}%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">APY</p>
                    </div>
                     <div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white">{formatTVL(opportunity.tvl)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Total Value Locked</p>
                    </div>
                </Card>

                {/* Description */}
                 <Card className="p-4">
                    <h4 className="text-md font-bold text-slate-800 dark:text-white mb-2">About {opportunity.protocol}</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{opportunity.description}</p>
                </Card>

                {/* AI Section */}
                <AskAI protocolName={opportunity.protocol} />

                 <a 
                    href={opportunity.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#89F336] text-black font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-[#72d62d] transition-all duration-300 transform hover:scale-105"
                >
                    <span className="flex items-center justify-center gap-2">
                        <GlobeAltIcon className="w-5 h-5" /> Visit Protocol
                    </span>
                </a>
            </div>
        </div>
    );
};

export const DeFi: React.FC = () => {
    const [selectedOpportunity, setSelectedOpportunity] = useState<DeFiOpportunity | null>(null);
    const [opportunities, setOpportunities] = useState<DeFiOpportunity[]>(MOCK_DEFI_OPPORTUNITIES);
    const [activeTab, setActiveTab] = useState<'All' | 'Staking' | 'Lending'>('All');
    
    const filteredOpportunities = opportunities.filter(opp => {
        if (activeTab === 'All') return true;
        return opp.type === activeTab;
    });

    const TabButton: React.FC<{ tab: 'All' | 'Staking' | 'Lending' }> = ({ tab }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`w-full py-2 font-semibold rounded-md transition-all duration-300 ${activeTab === tab ? 'bg-[#89F336] text-black shadow-md shadow-[#89F336]/40' : 'text-gray-500 dark:text-gray-400 hover:bg-[#89F336]/20'}`}
        >
            {tab}
        </button>
    );

    if (selectedOpportunity) {
        return <OpportunityDetail opportunity={selectedOpportunity} onBack={() => setSelectedOpportunity(null)} />;
    }

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 flex mb-4 animate-fade-in-up">
                <TabButton tab='All' />
                <TabButton tab='Staking' />
                <TabButton tab='Lending' />
            </div>

            <div className="flex-grow bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-[#89F336]/50 rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="h-full overflow-y-auto p-4">
                    <div className="space-y-4">
                        {filteredOpportunities.map((opp, index) => (
                            <div key={`${opp.protocol}-${opp.tokenSymbol}`} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <OpportunityCard opportunity={opp} onSelect={setSelectedOpportunity} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
