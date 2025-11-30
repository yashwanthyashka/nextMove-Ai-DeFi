import React, { useState, useEffect } from 'react';
import type { JobListing, Web3Event } from '../types';
import { fetchJobsAndEvents } from '../services/geminiService';
import { Card, Loader } from './UI';

const JobCard: React.FC<{ job: JobListing }> = ({ job }) => (
    <Card className="dark:hover:border-[#f4ffb8]/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 p-4">
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="block">
            <h3 className="font-semibold text-indigo-600 dark:text-[#f4ffb8]">{job.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{job.company}</p>
            <p className="text-xs text-gray-500 mt-1">{job.location}</p>
        </a>
    </Card>
);

const EventCard: React.FC<{ event: Web3Event }> = ({ event }) => (
    <Card className="dark:hover:border-[#f4ffb8]/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 p-4">
        <a href={event.url} target="_blank" rel="noopener noreferrer" className="block">
            <h3 className="font-semibold text-indigo-600 dark:text-[#f4ffb8]">{event.name}</h3>
            <p className="text-gray-700 dark:text-gray-300">{event.date}</p>
            <p className="text-xs text-gray-500 mt-1">{event.location}</p>
        </a>
    </Card>
);


type View = 'jobs' | 'events';

export const JobsAndEvents: React.FC = () => {
    const [view, setView] = useState<View>('jobs');
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [events, setEvents] = useState<Web3Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const { jobs, events } = await fetchJobsAndEvents();
                setJobs(jobs);
                setEvents(events);
            } catch (err) {
                setError("Failed to load data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const TabButton: React.FC<{ currentView: View, targetView: View, children: React.ReactNode }> = ({ currentView, targetView, children }) => (
        <button
            onClick={() => setView(targetView)}
            className={`w-full py-2 font-semibold rounded-md transition-all duration-300 ${currentView === targetView ? 'bg-indigo-600 dark:bg-[#f4ffb8] text-white shadow-md shadow-indigo-200 dark:shadow-[#f4ffb8]/40' : 'text-gray-500 dark:text-gray-400 hover:bg-indigo-100/50 dark:hover:bg-[#f4ffb8]/50'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="bg-gray-200 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 flex mb-4 animate-fade-in-up">
                <TabButton currentView={view} targetView='jobs'>Jobs</TabButton>
                <TabButton currentView={view} targetView='events'>Events</TabButton>
            </div>
            
            <div className="flex-grow bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-[#f4ffb8]/50 rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                 <div className="h-full overflow-y-auto p-4">
                    {isLoading && <Loader />}
                    {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
                    {!isLoading && !error && (
                        <div className="space-y-4">
                            {view === 'jobs' && jobs.map((job, index) => (
                                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                                    <JobCard job={job} />
                                </div>
                            ))}
                            {view === 'events' && events.map((event, index) => (
                                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};