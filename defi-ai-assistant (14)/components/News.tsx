import React, { useState, useEffect } from 'react';
import type { NewsArticle } from '../types';
import { fetchNews, summarizeArticleByTitle } from '../services/geminiService';
import { Card, Loader } from './UI';
import { ArrowUpRightIcon, ChevronLeftIcon } from './Icons';


const ArticleView: React.FC<{ article: NewsArticle, onBack: () => void }> = ({ article, onBack }) => {
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateSummary = async () => {
            if (!article) return;
            setIsLoading(true);
            setError(null);
            try {
                const generatedSummary = await summarizeArticleByTitle(article.title);
                setSummary(generatedSummary);
            } catch (err) {
                setError("Failed to generate summary.");
            } finally {
                setIsLoading(false);
            }
        };

        generateSummary();
    }, [article]);

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {article.imageUrl && (
                <div className="flex-shrink-0 h-48 w-full relative">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-black/80 via-slate-50/50 dark:via-black/40 to-transparent" />
                    <button 
                        onClick={onBack}
                        className="absolute top-4 left-4 p-2 text-slate-800 dark:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors z-10"
                        aria-label="Back to news list"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                </div>
            )}
            <div className="flex-grow overflow-y-auto p-4">
                {!article.imageUrl && (
                    <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 dark:text-[#f4ffb8] hover:text-slate-900 dark:hover:text-white mb-4">
                         <ChevronLeftIcon className="w-5 h-5" /> Back
                     </button>
                )}
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{article.title}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Source: {article.source}</p>

                {isLoading && <Loader />}
                {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
                {summary && <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{summary}</p>}

                <a 
                    href={article.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-indigo-600 dark:text-[#f4ffb8] hover:text-indigo-500 dark:hover:text-[#f4ffb8] font-semibold"
                >
                    Read Full Story <ArrowUpRightIcon className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};


const NewsCard: React.FC<{ article: NewsArticle, onSelect: (article: NewsArticle) => void }> = ({ article, onSelect }) => (
    <Card className="overflow-hidden dark:hover:border-[#f4ffb8]/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 group">
        <button onClick={() => onSelect(article)} className="block w-full text-left">
            {article.imageUrl && (
                <div className="h-40 overflow-hidden relative">
                    <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-800/80 to-transparent"></div>
                </div>
            )}
            <div className={`p-4 ${article.imageUrl ? '-mt-16 relative z-10' : ''}`}>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{article.source}</p>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-[#f4ffb8] transition-colors">{article.title}</h3>
            </div>
        </button>
    </Card>
);

export const News: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

    useEffect(() => {
        if (articles.length === 0) {
            const loadNews = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const fetchedArticles = await fetchNews();
                    setArticles(fetchedArticles);
                } catch (err) {
                    setError("Failed to load news. Please try again later.");
                } finally {
                    setIsLoading(false);
                }
            };
            loadNews();
        }
    }, [articles.length]);
    
    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex-grow bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-[#f4ffb8]/50 rounded-xl overflow-hidden animate-fade-in-up">
                {selectedArticle ? (
                    <ArticleView article={selectedArticle} onBack={() => setSelectedArticle(null)} />
                ) : (
                    <div className="h-full overflow-y-auto p-4">
                        {isLoading && <Loader />}
                        {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
                        {!isLoading && !error && (
                            <div className="space-y-4">
                                {articles.map((article, index) => (
                                    <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                                        <NewsCard article={article} onSelect={setSelectedArticle} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};