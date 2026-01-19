import React, { useState } from 'react';
import { Play, Check, ChevronRight, Lock, BookOpen, Clock, Activity } from 'lucide-react';

export default function SectionalMocks({ onStart }) {
    const [activeSubject, setActiveSubject] = useState('VARC'); // VARC | DILR | QA

    // --- TRUE SECTIONAL DATA GENERATOR ---
    // 10 Mocks per section
    const generateSectionals = (subject) => {
        let qCount = 22;
        if (subject === 'VARC') qCount = 24;
        if (subject === 'DILR') qCount = 22; // UPDATED: 22 Questions (Total 68 Pattern)

        return Array.from({ length: 10 }, (_, i) => ({
            id: `${subject}-${i + 1}`,
            title: `TRUE ${subject} SECTIONAL ${i + 1}`,
            subject: subject,
            questions: qCount,
            duration: 40,
            status: 'Upcoming', // Default to upcoming/fresh
            score: null,
            percentile: null,
            isLocked: false // ALL UNLOCKED per user request
        }));
    };

    const mocks = generateSectionals(activeSubject);

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-zinc-800 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-emerald-500" />
                        SECTIONAL <span className="text-zinc-500">ARSENAL</span>
                    </h2>
                    <p className="text-zinc-400 mt-2 font-mono">Focused fire intensity. 40 minutes only.</p>
                </div>

                {/* Subject Tabs */}
                <div className="flex bg-zinc-900 border-2 border-zinc-800 p-1 rounded-lg">
                    {['VARC', 'DILR', 'QA'].map(sub => (
                        <button
                            key={sub}
                            onClick={() => setActiveSubject(sub)}
                            className={`px-6 py-2 font-bold font-mono transition-all ${activeSubject === sub
                                ? 'bg-emerald-500 text-black shadow-sm'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {mocks.map((mock) => (
                    <div key={mock.id} className="group bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-600 p-6 flex items-center justify-between transition-all">

                        {/* Left: Info */}
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 flex items-center justify-center border-2 font-black text-xl 
                                ${mock.status === 'Attempted' ? 'border-zinc-700 bg-zinc-800 text-zinc-500' : 'border-emerald-500 bg-emerald-500/10 text-emerald-500'}`}>
                                {mock.id.split('-')[1]}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                    {mock.title}
                                </h3>
                                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-1">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {mock.duration} Mins</span>
                                    <span className="flex items-center gap-1"><Activity size={12} /> {mock.questions} Qs</span>
                                    <span className="text-zinc-600">|</span>
                                    <span>Standard CAT Pattern</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Actions/Stats */}
                        <div className="flex items-center gap-6">
                            {mock.status === 'Attempted' ? (
                                <div className="flex items-center gap-8 text-right">
                                    <div className="hidden md:block">
                                        <p className="text-zinc-500 text-[10px] uppercase font-bold">Score</p>
                                        <p className="text-xl font-bold font-mono text-white">{mock.score}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-zinc-500 text-[10px] uppercase font-bold">Percentile</p>
                                        <p className="text-xl font-bold font-mono text-emerald-400">{mock.percentile}</p>
                                    </div>
                                    <button className="px-6 py-3 border-2 border-zinc-700 text-zinc-300 font-bold hover:bg-zinc-800 uppercase text-xs tracking-wider">
                                        Review
                                    </button>
                                </div>
                            ) : (
                                <button
                                    disabled={mock.isLocked}
                                    onClick={() => onStart(mock)}
                                    className={`px-8 py-3 font-bold uppercase tracking-wider text-sm border-2 shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2
                                    ${mock.isLocked
                                            ? 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed shadow-none'
                                            : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500'}`}
                                >
                                    {mock.isLocked ? <Lock size={16} /> : <Play size={16} />}
                                    {mock.isLocked ? 'Locked' : 'Take Test'}
                                </button>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
