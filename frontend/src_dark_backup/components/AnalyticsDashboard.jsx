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
        <div className="bg-zinc-900 p-4 rounded-lg border-2 border-zinc-800 flex items-center gap-4 hover:border-zinc-500 transition-all shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000] group">
            <div className={`p-3 rounded border-2 border-zinc-900 ${color === 'text-emerald-400' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-black text-white">{value}</h3>
                    {sub && <span className={`text-[10px] font-mono ${sub.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{sub}</span>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 pb-32 space-y-12 bg-zinc-950 min-h-screen text-zinc-50 font-sans animate-in fade-in duration-500">

            {/* HEADER */}
            <header className="flex justify-between items-end border-b-2 border-zinc-800 pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                        <Activity className="text-emerald-500 w-8 h-8" />
                        Performance <span className="text-zinc-600">Nexus</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 font-mono text-sm">
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
                <div className="bg-zinc-900 p-6 rounded-lg border-2 border-zinc-800 relative overflow-hidden group hover:border-zinc-700 transition-all shadow-[8px_8px_0px_0px_#000]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 text-black rounded font-bold">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-wider text-white">
                                Score Progression
                            </h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500"></span> Score</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-zinc-600"></span> Percentile</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 border border-indigo-500"></span> Target (99%ile)</span>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ANALYTICS_MASTER_DATA.overview.scoreTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#71717a" tick={{ fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', fontSize: '12px', border: '2px solid #27272a', boxShadow: '4px 4px 0px 0px #000' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <ReferenceLine y={99} stroke="#6366f1" strokeDasharray="4 4" label={{ value: 'TARGET', fill: '#6366f1', fontSize: 10, position: 'right' }} />

                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#09090b', strokeWidth: 2, stroke: '#10b981' }}
                                    activeDot={{ r: 6, fill: '#10b981' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="percentile"
                                    stroke="#52525b"
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
                    <Layers size={16} className="text-zinc-500" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Global Exam Screener</h3>
                </div>
                <div className="bg-zinc-900 border-2 border-zinc-800 p-4 rounded-lg shadow-[8px_8px_0px_0px_#000]">
                    <SmartHeatmap
                        data={globalTree}
                        title="Global Sectional Analysis"
                    />
                </div>
            </section>

            {/* ACTION CENTER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. ERROR LOGS */}
                <div
                    onClick={() => onNavigate('errors')}
                    className="w-full bg-zinc-900 border-2 border-zinc-800 p-8 rounded-lg flex justify-between items-center cursor-pointer group hover:border-rose-500 transition-all shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000]"
                >
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-rose-500 text-black rounded font-bold group-hover:scale-110 transition-transform border-2 border-rose-900">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Active Error Logs</h2>
                            <p className="text-zinc-500 font-mono mt-1 text-xs">12 Critical Mistakes Pending</p>
                        </div>
                    </div>
                </div>

                {/* 2. MOCK FORENSICS */}
                <div
                    onClick={() => onNavigate('mock-analysis')}
                    className="w-full bg-zinc-900 border-2 border-zinc-800 p-8 rounded-lg flex justify-between items-center cursor-pointer group hover:border-indigo-500 transition-all shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000]"
                >
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-indigo-500 text-white rounded font-bold group-hover:scale-110 transition-transform border-2 border-indigo-900">
                            <Activity size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Deep Forensics</h2>
                            <p className="text-zinc-500 font-mono mt-1 text-xs">Analysis Across All Mocks</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
