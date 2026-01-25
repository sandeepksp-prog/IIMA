import React, { useState } from 'react';
import { Target, Clock, Zap, BookOpen, ChevronRight, Activity, TrendingUp, Award, BarChart3 } from 'lucide-react';

// Mock Data for Practice Summary
const PRACTICE_SUMMARY = {
    totalTests: 24,
    avgScore: 78,
    avgPercentile: 91.5,
    domains: [
        { id: 'varc', name: 'VARC', fullName: 'Verbal Ability & RC', color: 'text-teal-400', bg: 'bg-teal-500', count: 8, avg: 82 },
        { id: 'dilr', name: 'DILR', fullName: 'Data Interpretation & LR', color: 'text-amber-400', bg: 'bg-amber-500', count: 7, avg: 70 },
        { id: 'qa', name: 'QA', fullName: 'Quantitative Ability', color: 'text-rose-400', bg: 'bg-rose-500', count: 9, avg: 65 },
    ],
    recent: [
        { id: 101, name: 'Full Mock #6', date: '2 days ago', score: 88, percentile: 93, type: 'Full Mock' },
        { id: 102, name: 'VARC Sectional #4', date: '3 days ago', score: 42, percentile: 85, type: 'Sectional' },
        { id: 103, name: 'QA Topic Test: Algebra', date: '5 days ago', score: 28, percentile: 78, type: 'Topic Test' },
    ]
};

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-zinc-900 border-2 border-zinc-800 p-5 flex items-center gap-4 hover:border-zinc-600 transition-colors group shadow-[4px_4px_0px_0px_#27272a] hover:-translate-y-1">
        <div className={`p-3 border-2 border-zinc-700 bg-zinc-950 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{label}</p>
            <h4 className="text-3xl font-black text-white mt-1 leading-none">{value}</h4>
            {trend && <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1 border border-emerald-500/20 mt-1 inline-block">{trend}</span>}
        </div>
    </div>
);

const DomainCard = ({ domain, onSelect }) => (
    <button
        onClick={() => onSelect(domain.id)}
        className="relative bg-zinc-900 border-2 border-zinc-800 p-6 text-left hover:border-zinc-500 hover:bg-zinc-800 transition-all group overflow-hidden w-full shadow-[5px_5px_0px_0px_#27272a] active:translate-y-[2px] active:shadow-none"
    >
        {/* Progress Bar Top */}
        <div className={`absolute top-0 left-0 h-1.5 w-full ${domain.bg} opacity-50`}></div>

        <div className="flex justify-between items-start mb-4 mt-2">
            <div className={`p-2 border-2 border-zinc-700 bg-zinc-950 ${domain.color}`}>
                <Activity size={20} />
            </div>
            <span className="text-zinc-500 text-xs font-mono font-bold bg-zinc-950 px-2 py-1 border border-zinc-800">{domain.count} TESTS</span>
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1 group-hover:text-emerald-400 transition-colors">{domain.name}</h3>
        <p className="text-zinc-500 text-sm mb-6 font-mono border-b border-zinc-800 pb-4">{domain.fullName}</p>

        <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
                <span className="text-[10px] text-zinc-600 uppercase font-black">Avg. Score</span>
                <span className={`text-xl font-bold ${domain.color}`}>{domain.avg}%</span>
            </div>
            <div className="w-10 h-10 border-2 border-zinc-700 bg-zinc-950 flex items-center justify-center group-hover:bg-zinc-800 group-hover:border-zinc-500 transition-colors">
                <ChevronRight size={20} className="text-zinc-400 group-hover:text-white" />
            </div>
        </div>
    </button>
);

export default function PracticeHub({ onNavigate }) {
    // Current View State: 'summary' or a specific domain like 'varc'
    // Actually, 'PracticeHub' IS the summary. Clicking a domain should navigate to the list view.
    // We'll use the onNavigate prop passed from App/Dashboard to switch views.

    return (
        <div className="p-8 pb-32 space-y-12 bg-zinc-950 min-h-screen text-zinc-50 font-sans animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end border-b-2 border-zinc-800 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 border_2 border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-3 shadow-[2px_2px_0px_0px_#000]">
                        <BookOpen size={12} /> Practice Headquarters
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-100">
                        Training <span className="text-emerald-500 underline decoration-4 decoration-zinc-800 underline-offset-4">Summary</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 max-w-xl font-mono text-sm leading-relaxed">
                        > Review your overall training volume and select a domain to dive deeper.
                    </p>
                </div>
            </div>

            {/* High Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Target} label="Total Tests" value={PRACTICE_SUMMARY.totalTests} color="text-zinc-100" />
                <StatCard icon={TrendingUp} label="Avg. Score" value={PRACTICE_SUMMARY.avgScore} trend="+5.2 vs last week" color="text-emerald-400" />
                <StatCard icon={Award} label="Avg. Percentile" value={PRACTICE_SUMMARY.avgPercentile} color="text-zinc-100" />
                <StatCard icon={Clock} label="Study Time" value="48h 20m" color="text-zinc-100" />
            </div>

            {/* Domain Selection */}
            <div>
                <h3 className="text-lg font-bold text-zinc-200 mb-6 flex items-center gap-2 uppercase tracking-wider">
                    <BarChart3 size={18} className="text-indigo-500" /> Select Domain
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PRACTICE_SUMMARY.domains.map(dom => (
                        <DomainCard
                            key={dom.id}
                            domain={dom}
                            onSelect={(id) => onNavigate('practice_list', { domain: id })}
                        />
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900 border-2 border-zinc-800 overflow-hidden shadow-[5px_5px_0px_0px_#27272a]">
                <div className="p-4 border-b-2 border-zinc-800 bg-zinc-950 flex justify-between items-center">
                    <h3 className="font-bold text-zinc-400 text-sm uppercase tracking-wider">Recent Activity</h3>
                    <button className="text-[10px] font-bold uppercase text-indigo-400 hover:text-indigo-300 hover:underline">View All History</button>
                </div>
                <div className="divide-y-2 divide-zinc-800">
                    {PRACTICE_SUMMARY.recent.map(test => (
                        <div key={test.id} className="p-4 flex items-center justify-between hover:bg-zinc-800 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 border-2 ${test.score >= 80 ? 'bg-emerald-500 text-black border-emerald-600' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>
                                    {test.score >= 80 ? <Award size={18} /> : <Activity size={18} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-200 text-sm group-hover:text-white">{test.name}</h4>
                                    <p className="text-[11px] text-zinc-500 font-mono uppercase">{test.type} • {test.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-black text-zinc-200 text-lg">{test.score}</div>
                                <div className="text-[10px] text-zinc-600 uppercase font-bold">Score</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
