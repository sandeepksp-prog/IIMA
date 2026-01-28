import React, { useState } from 'react';
import {
    Play, Lock, Check, Clock, Calendar, BarChart2,
    ArrowRight, Sparkles, Trophy, Users, Star, AlertTriangle, Filter
} from 'lucide-react';

import { db, collection, getDocs } from '../services/firebase';

export default function MockList({ onStart }) {
    const [mockList, setMockList] = useState([]); // Stores current visible list
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('TRUE_CATS'); // 'TRUE_CATS' or 'PREVIOUS_YEARS'
    const [filter, setFilter] = useState('All');

    // GENERATE 20 TRUE CAT MOCKS (Static Data)
    const generateTrueCats = () => {
        return Array.from({ length: 20 }, (_, i) => {
            const id = i + 1;
            const isFree = id === 1;
            const status = id === 1 ? 'Live' : (id < 4 ? 'Attempted' : 'Upcoming');
            const difficulties = ['Moderate', 'Hard', 'Catastrophic'];

            return {
                id: `tc-${id}`,
                title: `TRUE CAT ${id} ${isFree ? '(Free)' : ''}`,
                type: "True CAT",
                status: status,
                questions: 66,
                duration: 120,
                difficulty: difficulties[i % 3],
                participants: 1000 + (id * 120),
                endsIn: status === 'Live' ? "2 Days" : null,
                unlocksIn: status === 'Upcoming' ? `${(id - 3) * 2} Days` : null,
                isFree: isFree,
                attempted: status === 'Attempted',
                score: status === 'Attempted' ? `${60 + (i * 2)}/198` : null,
                percentile: status === 'Attempted' ? `${(85 + (i)).toFixed(1)}%ile` : null
            };
        });
    };

    // GENERATE PREVIOUS YEAR PAPERS (2020-2023)
    const generatePreviousYears = () => {
        const years = [2023, 2022, 2021, 2020];
        const slots = [1, 2, 3];
        let papers = [];

        years.forEach(year => {
            slots.forEach(slot => {
                papers.push({
                    id: `py-${year}-${slot}`,
                    title: `CAT ${year} - Slot ${slot}`,
                    type: "Previous Year",
                    status: "Unlocked", // All PY papers unlocked for now
                    questions: 66,
                    duration: 120,
                    difficulty: "Actual CAT",
                    participants: 5000 + (year * 100) + (slot * 50),
                    isFree: true,
                    attempted: false,
                    year: year
                });
            });
        });
        return papers;
    };

    // DATA LOADING EFFECT
    React.useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            if (activeTab === 'TRUE_CATS') {
                const data = generateTrueCats();
                if (filter === 'All') setMockList(data);
                else if (filter === 'Live') setMockList(data.filter(m => m.status === 'Live'));
                else if (filter === 'Attempted') setMockList(data.filter(m => m.status === 'Attempted'));
            } else {
                // Previous Years - Filter by Year logic if needed, or just show all
                const data = generatePreviousYears();
                if (filter === 'All') setMockList(data);
                else setMockList(data.filter(m => m.year.toString() === filter));
            }
            setLoading(false);
        }, 600);
    }, [activeTab, filter]);

    // Available Filters Calculation
    const getFilters = () => {
        if (activeTab === 'TRUE_CATS') return ['All', 'Live', 'Attempted'];
        return ['All', '2023', '2022', '2021', '2020'];
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* HEADER & TABS */}
            <div className="flex flex-col gap-6 border-b-2 border-zinc-800 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                            <span className="bg-emerald-500 text-black px-2 text-2xl shadow-[4px_4px_0px_0px_#27272a]">MOCKS</span>
                            WAR ROOM
                        </h2>
                        <p className="text-zinc-400 mt-2 font-mono text-sm leading-relaxed max-w-xl">
                            Select your battleground. "True CATs" are predicted mocks for 2025. "Previous Years" are actual historical papers.
                        </p>
                    </div>
                </div>

                {/* MAIN TABS */}
                <div className="flex gap-4">
                    <button
                        onClick={() => { setActiveTab('TRUE_CATS'); setFilter('All'); }}
                        className={`px-6 py-3 font-black uppercase tracking-wider text-sm border-b-4 transition-all
                            ${activeTab === 'TRUE_CATS' ? 'border-emerald-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}
                        `}
                    >
                        True CAT Mocks
                    </button>
                    <button
                        onClick={() => { setActiveTab('PREVIOUS_YEARS'); setFilter('All'); }}
                        className={`px-6 py-3 font-black uppercase tracking-wider text-sm border-b-4 transition-all
                            ${activeTab === 'PREVIOUS_YEARS' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}
                        `}
                    >
                        Previous Year Papers
                    </button>
                </div>

                {/* SUB-FILTERS */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {getFilters().map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                                font-bold px-4 py-2 border-2 transition-all uppercase text-xs whitespace-nowrap
                                ${filter === f
                                    ? 'bg-white text-black border-white shadow-[3px_3px_0px_0px_#27272a]'
                                    : 'bg-zinc-900 text-zinc-500 border-zinc-700 hover:border-zinc-500 hover:text-white'
                                }
                            `}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* MOCK GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {loading ? (
                    <div className="col-span-3 text-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-zinc-500 font-mono">Loading Operations...</p>
                    </div>
                ) : (
                    mockList.map((mock) => (
                        <MockCard key={mock.id} mock={mock} onStart={onStart} />
                    ))
                )}
            </div>
        </div>
    );
}

function MockCard({ mock, onStart }) {
    const isLocked = !mock.isFree && mock.status === "Upcoming";
    const isAttempted = mock.attempted;

    return (
        <div className="group bg-zinc-900 border-2 border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-600 transition-all hover:-translate-y-1 relative overflow-hidden shadow-[5px_5px_0px_0px_#27272a]">

            {/* Top Badge */}
            <div className="flex justify-between items-start mb-4">
                <span className={`
          px-2 py-1 text-xs font-bold font-mono border-2 uppercase
          ${mock.status === 'Live' ? 'bg-red-500/10 text-red-500 border-red-500/50 animate-pulse' :
                        mock.status === 'Attempted' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/50' :
                            'bg-zinc-800 text-zinc-500 border-zinc-700'}
        `}>
                    {mock.status}
                </span>
                {mock.isFree && (
                    <span className="px-2 py-1 bg-emerald-500 text-black text-xs font-bold border-2 border-emerald-600 -rotate-2 shadow-sm">
                        FREE
                    </span>
                )}
            </div>

            {/* Title & Meta */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-100 mb-1 leading-tight group-hover:text-emerald-400 transition-colors">
                    {mock.title}
                </h3>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-2">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mock.duration}m</span>
                    <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> {mock.questions} Qs</span>
                    <span className={`flex items-center gap-1 ${mock.difficulty === 'Hard' ? 'text-red-400' :
                        mock.difficulty === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400'
                        }`}>
                        {mock.difficulty}
                    </span>
                </div>
            </div>

            {/* Conditional Content */}
            {isAttempted ? (
                <div className="bg-zinc-950 p-4 border border-zinc-800 mb-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-zinc-500 font-mono">SCORE</p>
                            <p className="text-xl font-bold text-white">{mock.score}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-500 font-mono">PERCENTILE</p>
                            <p className="text-xl font-bold text-emerald-400">{mock.percentile}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-4 space-y-2">
                    {mock.endsIn && (
                        <p className="text-xs text-red-400 font-mono flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Ends in {mock.endsIn}
                        </p>
                    )}
                    {mock.unlocksIn && (
                        <p className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                            <Lock className="w-3 h-3" /> Unlocks in {mock.unlocksIn}
                        </p>
                    )}
                </div>
            )}

            {/* Action Button */}
            <button
                onClick={() => !isLocked && onStart(mock)}
                disabled={isLocked}
                className={`
          w-full py-3 font-bold uppercase tracking-wider text-sm border-2 transition-transform active:translate-y-[2px] active:translate-x-[2px] active:shadow-none shadow-[4px_4px_0px_0px_#000]
          ${isAttempted
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700'
                        : isLocked
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed shadow-none'
                            : 'bg-emerald-500 border-emerald-600 text-black hover:bg-emerald-400'}
        `}
            >
                {isAttempted ? 'View Analysis' : isLocked ? 'Locked' : 'Start Battle'}
            </button>

        </div>
    );
}
