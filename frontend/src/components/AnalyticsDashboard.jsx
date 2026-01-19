import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Target, TrendingUp, AlertTriangle, Layers, Activity, Brain } from 'lucide-react';
import { ANALYTICS_MASTER_DATA } from '../data/analyticsMasterData';
import TechTree from './TechTree';
import SmartHeatmap from './SmartHeatmap';

export default function AnalyticsDashboard({ onNavigate }) {
    // Construct Global Tree from Sections for the "Main Screener"
    // SmartHeatmap expects an object { children: [...] } or array [...]
    const globalTree = {
        name: 'CAT Global',
        children: [
            ANALYTICS_MASTER_DATA.sections.VARC.performanceTree,
            ANALYTICS_MASTER_DATA.sections.DILR.performanceTree,
            ANALYTICS_MASTER_DATA.sections.QA.performanceTree
        ]
    };

    const GlobalKpiCard = ({ icon: Icon, label, value, sub, color }) => (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-colors group">
            <div className={`p-3 rounded-lg bg-slate-950 border border-slate-800 ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-black text-slate-100">{value}</h3>
                    {sub && <span className={`text-[10px] font-mono ${sub.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{sub}</span>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 pb-32 space-y-12 bg-slate-950 min-h-screen text-slate-50 font-sans animate-in fade-in duration-500">

            {/* HEADER */}
            <header className="flex justify-between items-end border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-100 flex items-center gap-3">
                        <Activity className="text-emerald-500 w-8 h-8" />
                        Performance <span className="text-slate-600">Nexus</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-mono text-sm">
                        Live Intelligence Stream • <span className="text-emerald-500">v2.4.0 Online</span>
                    </p>
                </div>
                {/* Global KPIs Row */}
                <div className="flex gap-4">
                    {ANALYTICS_MASTER_DATA.overview.kpi.map((kpi, i) => (
                        <div key={i} className="hidden lg:block">
                            <GlobalKpiCard icon={Target} {...kpi} />
                        </div>
                    ))}
                </div>
            </header>

            {/* 1. SCORE PROGRESSION BANNER (Full Width) */}
            <section className="w-full">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-wider text-slate-200">
                                Score Progression
                            </h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Score</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Percentile</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 border border-indigo-400"></span> Target (99%ile)</span>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ANALYTICS_MASTER_DATA.overview.scoreTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <ReferenceLine y={99} stroke="#6366f1" strokeDasharray="4 4" label={{ value: 'TARGET', fill: '#6366f1', fontSize: 10, position: 'right' }} />

                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#10b981' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="percentile"
                                    stroke="#475569"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* 2. GLOBAL HEATMAP SCREENER (Stock Market Style) */}
            <section>
                <div className="mb-4 flex items-center gap-2">
                    <Layers size={16} className="text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Global Exam Screener</h3>
                </div>
                <SmartHeatmap
                    data={globalTree}
                    title="Global Sectional Analysis"
                />
            </section>

            {/* 3. SECTOR ANALYSIS -> REMOVED AS PER REQUEST */}


            {/* ERROR LOG SHORTCUT BANNER */}
            <div
                onClick={() => onNavigate('errors')}
                className="w-full bg-gradient-to-r from-rose-900/20 to-slate-900 border border-rose-900/30 p-8 rounded-2xl flex justify-between items-center cursor-pointer group hover:border-rose-500/50 transition-all"
            >
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-rose-500/10 rounded-full text-rose-500 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Active Error Logs</h2>
                        <p className="text-rose-200/60 font-mono mt-1">12 Critical Mistakes in last session requires review.</p>
                    </div>
                </div>
                <div className="px-6 py-3 bg-rose-600 text-white font-bold uppercase tracking-widest text-xs rounded-lg shadow-lg group-hover:bg-rose-500 transition-colors">
                    Review Analysis
                </div>
            </div>

        </div>
    );
}
