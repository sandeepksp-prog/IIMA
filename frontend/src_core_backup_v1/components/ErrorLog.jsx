import React, { useState } from 'react';
import { AlertCircle, Search, Filter, Check, X, BookOpen, Lightbulb, PlayCircle, ArrowRight, Clock, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MISTAKES_DATA = [
    {
        id: 1,
        questionString: "A pipe can fill a tank in 4 hours...",
        topic: "Time & Work",
        type: "Trap",
        difficulty: "Moderate",
        timeSpent: "3m 12s",
        mistakeType: "Conceptual",
        correction: "You missed the negative work done by the leak property (Efficiency subtraction).",
        solution: "Efficiency of A = 1/4. Efficiency of Leak = -1/x. Net = 1/6. Solve for x.",
        date: "Mock 12"
    },
    {
        id: 2,
        questionString: "Find the number of integral solutions for...",
        topic: "Algebra",
        type: "Standard",
        difficulty: "Hard",
        timeSpent: "4m 45s",
        mistakeType: "Calculation",
        correction: "Calculation error in the final quadratic root extraction.",
        solution: "Roots are (-b + √D)/2a. √D was √121 = 11. You took 13.",
        date: "Sectional QA-04"
    },
    {
        id: 3,
        questionString: "The tone of the passage can be best described as...",
        topic: "RC Tone",
        type: "Inference",
        difficulty: "High",
        timeSpent: "1m 20s",
        mistakeType: "Interpretation",
        correction: "Confused 'Critical' with 'Cynical'.",
        solution: "Passage critiques the method but hopes for improvement (Critical). Cynical implies hopelessness.",
        date: "Mock 12"
    },
    {
        id: 4,
        questionString: "Arrangement of 8 people in a circle...",
        topic: "LR Seating",
        type: "Set",
        difficulty: "Extreme",
        timeSpent: "12m 10s",
        mistakeType: "Time Trap",
        difficulty: "Extreme",
        correction: "Spent too long on Case 3 which was invalid initially.",
        solution: "Always check 'Immediate Right' condition first to eliminate cases.",
        date: "Mock 11"
    }
];

const FREQUENCY_DATA = [
    { name: 'Conceptual', value: 12, color: '#8b5cf6' },
    { name: 'Calculation', value: 8, color: '#3b82f6' },
    { name: 'Interpretation', value: 5, color: '#10b981' },
    { name: 'Time Trap', value: 4, color: '#ef4444' },
];

export default function ErrorLog() {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedMistake, setSelectedMistake] = useState(null);

    return (
        <div className="flex h-[calc(100vh-2rem)] md:h-screen bg-zinc-950 text-zinc-50 overflow-hidden">

            {/* LEFT LIST */}
            <div className={`w-full md:w-1/3 border-r border-zinc-800 flex flex-col ${selectedMistake ? 'hidden md:flex' : 'flex'}`}>

                {/* Filter Header */}
                <div className="p-4 border-b border-zinc-800">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                        <AlertCircle className="text-red-500" /> Error Log
                    </h2>

                    {/* MINI CHART */}
                    <div className="mb-4 h-24 bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
                        <div className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">Mistake Frequency</div>
                        <div style={{ width: '100%', height: '100%' }}>
                            <ResponsiveContainer width="100%" height={60}>
                                <BarChart data={FREQUENCY_DATA}>
                                    <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                                        {FREQUENCY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', fontSize: '10px' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex gap-2 text-xs font-bold overflow-x-auto pb-2 no-scrollbar">
                        {['all', 'Conceptual', 'Calculation', 'Time Trap'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 rounded-full border transition-all whitespace-nowrap
                        ${activeTab === tab
                                        ? 'bg-white text-black border-white'
                                        : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mistake List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {MISTAKES_DATA.map((mistake) => (
                        <div
                            key={mistake.id}
                            onClick={() => setSelectedMistake(mistake)}
                            className={`p-4 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-900/50 transition-colors
                    ${selectedMistake?.id === mistake.id ? 'bg-zinc-900 border-l-2 border-l-emerald-500' : 'border-l-2 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded 
                            ${mistake.mistakeType === 'Conceptual' ? 'bg-purple-900/30 text-purple-400' :
                                        mistake.mistakeType === 'Time Trap' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                    {mistake.mistakeType}
                                </span>
                                <span className="text-[10px] text-zinc-600 font-mono">{mistake.date}</span>
                            </div>
                            <h4 className="font-bold text-sm text-zinc-300 line-clamp-2 mb-1">{mistake.questionString}</h4>
                            <div className="flex items-center gap-4 text-xs text-zinc-500">
                                <span>{mistake.topic}</span>
                                <span className="flex items-center gap-1"><Clock size={10} /> {mistake.timeSpent}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT DETAIL VIEW */}
            <div className={`w-full md:w-2/3 bg-zinc-900/30 flex-col ${selectedMistake ? 'flex' : 'hidden md:flex'}`}>
                {selectedMistake ? (
                    <div className="flex-1 overflow-y-auto p-8">
                        <button onClick={() => setSelectedMistake(null)} className="md:hidden mb-4 text-xs text-zinc-500 font-bold flex items-center gap-1">
                            ← Back to List
                        </button>

                        <div className="mb-8">
                            <span className="text-emerald-500 font-mono text-xs font-bold tracking-widest uppercase mb-2 block">Root Cause Analysis</span>
                            <h2 className="text-2xl font-black text-white mb-4">{selectedMistake.questionString}</h2>
                            <div className="flex gap-4 mb-6">
                                <Badge label={selectedMistake.difficulty} color="bg-zinc-800 text-zinc-300" />
                                <Badge label={selectedMistake.type} color="bg-zinc-800 text-zinc-300" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* The Mistake */}
                            <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-xl">
                                <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                                    <X size={18} /> What went wrong?
                                </h4>
                                <p className="text-zinc-300 leading-relaxed text-sm">
                                    {selectedMistake.correction}
                                </p>
                            </div>

                            {/* The Fix */}
                            <div className="p-5 bg-emerald-950/20 border border-emerald-900/30 rounded-xl">
                                <h4 className="text-emerald-400 font-bold flex items-center gap-2 mb-2">
                                    <Check size={18} /> The Correct Approach
                                </h4>
                                <p className="text-zinc-300 leading-relaxed text-sm">
                                    {selectedMistake.solution}
                                </p>
                            </div>

                            {/* Actionable Learning Path */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-emerald-500/50 transition-colors group cursor-pointer">
                                    <h4 className="text-zinc-100 font-bold flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
                                        <PlayCircle size={14} className="text-blue-400" /> Micro-Lesson
                                    </h4>
                                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 mb-1">Mastering Negative Efficiency</div>
                                    <div className="text-[10px] text-zinc-500">Video • 4m 30s</div>
                                </div>

                                <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-emerald-500/50 transition-colors group cursor-pointer">
                                    <h4 className="text-zinc-100 font-bold flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
                                        <ArrowRight size={14} className="text-emerald-500" /> Immediate Drill
                                    </h4>
                                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 mb-1">Solve 5 Similar Questions</div>
                                    <div className="text-[10px] text-zinc-500">Practice Set • ~15 mins</div>
                                </div>
                            </div>

                        </div>

                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
                        <Filter size={48} className="mb-4 opacity-20" />
                        <p className="font-mono text-sm">Select a mistake from the log to analyze.</p>
                    </div>
                )}
            </div>

        </div>
    );
}

const Badge = ({ label, color }) => (
    <span className={`px-3 py-1 rounded text-xs font-bold ${color}`}>{label}</span>
);
