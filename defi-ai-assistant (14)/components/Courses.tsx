
import React, { useState, useEffect } from 'react';
import { Card, Loader } from './UI';
import { AssistantIcon, ChartBarIcon, CheckCircleIcon, ChevronDownIcon, ChevronLeftIcon, SparklesIcon, AptosIcon, BookOpenIcon } from './Icons';
import { fetchCourseContent } from '../services/geminiService';
import type { CourseContent } from '../types';

// New Icons for the Hub
const CodeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

const LayerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);

const courseData = [
    {
        level: 'Beginner',
        title: 'Aptos Essentials',
        description: 'Master the fundamentals of the Aptos blockchain, the Move VM, and set up your development environment.',
        icon: <AptosIcon className="w-8 h-8 text-[#89F336]" />,
        topics: [
            'What is Aptos?',
            'The Aptos Difference: Parallel Execution & Safety',
            'Setting up Aptos CLI and Dev Environment',
            'Creating Your First Aptos Wallet',
            'Understanding Resources & Move Basics',
            'Your First Move Module',
            'The APT Token & Gas System',
            'Navigating Aptos Explorers'
        ]
    },
    {
        level: 'Intermediate',
        title: 'Move Developer',
        description: 'Deep dive into smart contract development with Move. Learn structs, capabilities, and the Photon SDK.',
        icon: <CodeIcon className="w-8 h-8 text-blue-400" />,
        topics: [
            'Advanced Move: Structs, Abilities & Generics',
            'Building Smart Contracts with Move',
            'Aptos Modules & Entry Functions',
            'Using Photon SDK with Aptos',
            'Interacting with Aptos RPC',
            'Writing Secure Move Code',
            'Upgradeable Modules',
            'Staking & Validator Concepts'
        ]
    },
    {
        level: 'Advanced',
        title: 'Protocol Architect',
        description: 'Architect full-scale DeFi protocols, utilize the Indexer, and master formal verification with Move Prover.',
        icon: <LayerIcon className="w-8 h-8 text-purple-400" />,
        topics: [
            'Building DeFi Protocols in Move',
            'Aptos Indexer & On-Chain Data',
            'Move Prover: Formal Verification',
            'Resource Accounts & Advanced Patterns',
            'Zero-Knowledge Integrations on Aptos',
            'Build a Launchpad or AMM',
            'Multi-Agent Workflows on Aptos'
        ]
    }
];

const Quiz: React.FC<{
    content: CourseContent;
    isComplete: boolean;
    onCorrect: () => void;
}> = ({ content, isComplete, onCorrect }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const handleAnswerSelect = (option: string) => {
        if (isComplete || selectedAnswer) return;

        setSelectedAnswer(option);
        if (option === content.quiz.correctAnswer) {
            setTimeout(() => onCorrect(), 500);
        }
    };

    return (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#89F336]/30">
            <h5 className="font-semibold text-slate-800 dark:text-white mb-3">{content.quiz.question}</h5>
            <div className="space-y-2">
                {content.quiz.options.map((option, index) => {
                    const isCorrect = option === content.quiz.correctAnswer;
                    const isSelected = option === selectedAnswer;

                    let buttonClass = "w-full text-left p-3 rounded-lg border-2 transition-all duration-300 disabled:cursor-not-allowed";

                    if (isComplete) {
                        buttonClass += isCorrect 
                            ? " bg-[#89F336]/20 border-[#89F336] text-slate-800 dark:text-white" 
                            : " bg-gray-200 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-500";
                    } else if (selectedAnswer) {
                        if (isCorrect) {
                            buttonClass += " bg-[#89F336]/20 border-[#89F336] text-slate-800 dark:text-white animate-pulse";
                        } else if (isSelected) {
                            buttonClass += " bg-red-500/20 border-red-500 text-gray-700 dark:text-gray-300";
                        } else {
                             buttonClass += " bg-gray-200 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-500";
                        }
                    } else {
                        buttonClass += " bg-gray-200 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 hover:border-[#89F336] dark:hover:border-[#89F336] hover:bg-[#89F336]/10 dark:hover:bg-[#89F336]/10";
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={isComplete || !!selectedAnswer}
                            className={buttonClass}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {selectedAnswer && !isComplete && selectedAnswer !== content.quiz.correctAnswer && (
                 <p className="text-red-500 dark:text-red-400 text-sm mt-3 text-center">Not quite. Try closing and re-opening this lesson to try again!</p>
            )}
        </div>
    );
};


const TopicItem: React.FC<{ topic: string, level: string, index: number, isComplete: boolean, onMarkComplete: () => void }> = ({ topic, level, index, isComplete, onMarkComplete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<CourseContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = async () => {
        const shouldOpen = !isOpen;
        setIsOpen(shouldOpen);

        if (shouldOpen && !content && !isLoading) {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedContent = await fetchCourseContent(topic, level);
                setContent(fetchedContent);
            } catch (err) {
                setError("Failed to load content.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="border-b border-gray-200 dark:border-[#89F336]/30 last:border-b-0 animate-fade-in-up" style={{ animationDelay: `${index * 75}ms`}}>
            <button
                onClick={handleToggle}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-200/50 dark:hover:bg-[#89F336]/10 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {isComplete ? (
                        <CheckCircleIcon className="w-5 h-5 text-[#89F336] flex-shrink-0" />
                    ) : (
                        <div className="w-5 h-5 border-2 border-gray-400 dark:border-gray-600 rounded-full flex-shrink-0" />
                    )}
                    <span className={`font-semibold transition-colors ${isComplete ? 'text-gray-500' : 'text-slate-800 dark:text-white'}`}>{topic}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px]' : 'max-h-0'}`}>
                <div className="p-4 border-t border-gray-200 dark:border-[#89F336]/20 bg-gray-50/50 dark:bg-black/20">
                    {isLoading && <Loader />}
                    {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
                    {content && (
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                             <h4 className="font-bold text-lg text-[#89F336]">{content.title}</h4>
                             <p className="whitespace-pre-wrap leading-relaxed text-sm">{content.explanation}</p>
                             
                             {/* Example / Code Section */}
                             <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                                <div className="bg-gray-800 px-3 py-1 border-b border-gray-700 flex items-center gap-2">
                                    <CodeIcon className="w-4 h-4 text-[#89F336]" />
                                    <span className="text-xs font-mono text-gray-300">Example / Code</span>
                                </div>
                                <div className="p-3 overflow-x-auto">
                                    <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap">{content.example}</pre>
                                </div>
                             </div>

                             {content.quiz.options.length > 0 && (
                                <Quiz content={content} isComplete={isComplete} onCorrect={onMarkComplete} />
                             )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CourseDetailView: React.FC<{ course: typeof courseData[0], onBack: () => void, completedTopics: string[], onMarkComplete: (topic: string) => void }> = ({ course, onBack, completedTopics, onMarkComplete }) => {
    const progressPercent = (completedTopics.length / course.topics.length) * 100;
    
    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            <div className="flex-shrink-0 p-4">
                 <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#89F336]/20 rounded-full transition-colors">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    {course.icon}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{course.title}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{course.description}</p>
                    </div>
                </div>
                 <div className="mt-4">
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{completedTopics.length} / {course.topics.length}</span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-[#89F336] h-2 rounded-full transition-all shadow-[0_0_10px_#89F336]" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                 </div>
            </div>
            <div className="flex-grow bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border-t border-gray-200 dark:border-[#89F336]/30 rounded-t-xl overflow-y-auto">
                {course.topics.map((topic, index) => (
                    <TopicItem 
                        key={index} 
                        topic={topic} 
                        level={course.level} 
                        index={index}
                        isComplete={completedTopics.includes(topic)}
                        onMarkComplete={() => onMarkComplete(topic)}
                    />
                ))}
            </div>
        </div>
    );
};

const CourseCard: React.FC<{ course: typeof courseData[0], onStart: () => void, completedCount: number }> = ({ course, onStart, completedCount }) => {
    const totalTopics = course.topics.length;
    const progressPercent = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;
    
    return (
        <Card className="p-6 flex flex-col h-full group overflow-hidden relative !duration-500 hover:scale-[1.03] hover:-translate-y-1 dark:hover:shadow-xl dark:hover:shadow-[#89F336]/20 border-[#89F336]/20">
            {/* Parallax background element */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#89F336]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl transition-transform duration-700 ease-out group-hover:translate-x-4 group-hover:translate-y-4 group-hover:scale-150" />
            
            <div className="relative z-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4 transition-transform duration-500 ease-out group-hover:translate-x-1">
                    <div className="transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-x-2 group-hover:-rotate-3">
                        {course.icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{course.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold text-[10px]">{course.level}</p>
                    </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow transition-transform duration-500 ease-out group-hover:translate-x-1 text-sm leading-relaxed">{course.description}</p>
                
                <div className="mt-auto">
                    <div className="mb-4">
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{completedCount} / {totalTopics}</span>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-700/50 rounded-full h-1.5">
                            <div className="bg-[#89F336] h-1.5 rounded-full transition-all shadow-[0_0_5px_#89F336]" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                    <button 
                        onClick={onStart}
                        className="w-full bg-[#89F336] text-black font-bold py-3 rounded-lg hover:bg-[#72d62d] transition-colors duration-300 shadow-lg"
                    >
                        {completedCount > 0 ? 'Continue Learning' : 'Start Course'}
                    </button>
                </div>
            </div>
        </Card>
    );
};


export const Courses: React.FC = () => {
    const [selectedCourse, setSelectedCourse] = useState<typeof courseData[0] | null>(null);
    const [progress, setProgress] = useState<Record<string, string[]>>(() => {
        try {
            const savedProgress = localStorage.getItem('courseProgress');
            return savedProgress ? JSON.parse(savedProgress) : {};
        } catch (error) {
            console.error("Could not parse course progress from localStorage", error);
            return {};
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('courseProgress', JSON.stringify(progress));
        } catch (error) {
            console.error("Could not save course progress to localStorage", error);
        }
    }, [progress]);

    const handleMarkComplete = (level: string, topicTitle: string) => {
        setProgress(prev => {
            const levelProgress = prev[level] || [];
            if (levelProgress.includes(topicTitle)) {
                return prev; // Already complete, do nothing
            }
            const newLevelProgress = [...levelProgress, topicTitle];
            return { ...prev, [level]: newLevelProgress };
        });
    };
    
    if (selectedCourse) {
        return <CourseDetailView 
            course={selectedCourse} 
            onBack={() => setSelectedCourse(null)}
            completedTopics={progress[selectedCourse.level] || []}
            onMarkComplete={(topic) => handleMarkComplete(selectedCourse.level, topic)}
        />;
    }

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex-grow overflow-y-auto -mx-4 px-4 pb-4">
                 <div className="text-center mb-6 mt-2">
                    <h2 className="text-2xl font-bold text-white mb-1">Aptos Learning Hub</h2>
                    <p className="text-gray-400 text-sm">Master the Move language and build on Aptos.</p>
                 </div>
                 <div className="space-y-6 max-w-4xl mx-auto">
                    {courseData.map((course, index) => (
                        <div key={course.level} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                            <CourseCard 
                                course={course} 
                                onStart={() => setSelectedCourse(course)}
                                completedCount={(progress[course.level] || []).length}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
