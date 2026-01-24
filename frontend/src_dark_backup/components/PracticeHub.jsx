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
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition-colors group">
        <div className={`p-3 rounded-xl ${color.replace('text', 'bg')}/10 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
            <h4 className="text-2xl font-black text-white mt-0.5">{value}</h4>
            {trend && <span className="text-[10px] font-mono text-green-400">{trend}</span>}
        </div>
    </div>
);

const DomainCard = ({ domain, onSelect }) => (
    <button
        onClick={() => onSelect(domain.id)}
        className="relative bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left hover:border-slate-600 hover:bg-slate-800/50 transition-all group overflow-hidden w-full"
    >
        <div className={`absolute top-0 left-0 w-1.5 h-full ${domain.bg}`}></div>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${domain.bg}/10 ${domain.color}`}>
                <Activity size={20} />
            </div>
            <span className="text-slate-500 text-xs font-mono">{domain.count} Tests Taken</span>
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{domain.name}</h3>
        <p className="text-slate-400 text-sm mb-6">{domain.fullName}</p>

        <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Avg. Score</span>
                <span className={`text-lg font-bold ${domain.color}`}>{domain.avg}%</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <ChevronRight size={16} className="text-slate-300" />
            </div>
        </div>
    </button>
);

export default function PracticeHub({ onNavigate }) {
    // Current View State: 'summary' or a specific domain like 'varc'
    // Actually, 'PracticeHub' IS the summary. Clicking a domain should navigate to the list view.
    // We'll use the onNavigate prop passed from App/Dashboard to switch views.

    return (
        <div className="p-8 pb-32 space-y-12 bg-slate-950 min-h-screen text-slate-50 font-sans animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-slate-800 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3 border border-indigo-800/50">
                        <BookOpen size={12} /> Practice Headquarters
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-100">
                        Training <span className="text-indigo-500">Summary</span>
                    </h1>
                    <p className="text-slate-500 mt-2 max-w-xl">
                        Review your overall training volume and select a domain to dive deeper.
                    </p>
                </div>
            </div>

            {/* High Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Target} label="Total Tests" value={PRACTICE_SUMMARY.totalTests} color="text-blue-400" />
                <StatCard icon={TrendingUp} label="Avg. Score" value={PRACTICE_SUMMARY.avgScore} trend="+5.2 vs last week" color="text-emerald-400" />
                <StatCard icon={Award} label="Avg. Percentile" value={PRACTICE_SUMMARY.avgPercentile} color="text-purple-400" />
                <StatCard icon={Clock} label="Study Time" value="48h 20m" color="text-amber-400" />
            </div>

            {/* Domain Selection */}
            <div>
                <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2 uppercase tracking-wider">
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Recent Activity</h3>
                    <button className="text-[10px] font-bold uppercase text-indigo-400 hover:text-indigo-300">View All History</button>
                </div>
                <div className="divide-y divide-slate-800/50">
                    {PRACTICE_SUMMARY.recent.map(test => (
                        <div key={test.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${test.score >= 80 ? 'bg-emerald-900/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                    {test.score >= 80 ? <Award size={18} /> : <Activity size={18} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-200 text-sm">{test.name}</h4>
                                    <p className="text-[11px] text-slate-500 font-mono">{test.type} • {test.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-black text-slate-200">{test.score}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Score</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
