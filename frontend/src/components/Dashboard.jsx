import React, { useState } from 'react';
import {
    Play, Target, AlertTriangle, BookOpen,
    TrendingUp, Activity, Calendar, Award,
    Zap, ArrowRight, BarChart3, ChevronRight
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// --- Dummy Data ---
const performanceData = [
    { name: 'Mock 1', score: 45 },
    { name: 'Mock 2', score: 52 },
    { name: 'Mock 3', score: 48 },
    { name: 'Mock 4', score: 65 },
    { name: 'Mock 5', score: 72 },
    { name: 'Mock 6', score: 85 },
];

const subjectData = [
    { subject: 'VARC', A: 85, fullMark: 100 },
    { subject: 'DILR', A: 65, fullMark: 100 },
    { subject: 'QA', A: 45, fullMark: 100 },
];

// GitHub-style contribution data (simplified)
const contributionData = Array.from({ length: 52 }, (_, i) => ({
    week: i,
    days: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
}));

export default function Dashboard({ onStartMock, onOpenDailyInsights }) {
    const [analyticsType, setAnalyticsType] = useState('full'); // 'full' | 'sectional'

    return (
        <div className="p-8 space-y-12 max-w-7xl mx-auto">

            {/* SECTION A: BENTO GRID HERO */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center gap-2">
                    <Zap className="text-yellow-400 fill-yellow-400" />
                    Mission Control
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[180px]">

                    {/* Widget 1: Dominant - Start Mock */}
                    <div className="md:col-span-2 md:row-span-2 bg-zinc-900 border-2 border-zinc-800 shadow-[5px_5px_0px_0px_#27272a] p-6 flex flex-col justify-between group cursor-pointer hover:border-zinc-600 transition-all"
                        onClick={onStartMock}>
                        <div className="flex justify-between items-start">
                            <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded text-xs font-mono border border-emerald-500/20">
                                RECOMMENDED
                            </span>
                            <Play className="w-8 h-8 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                        </div>

                        <div>
                            <h3 className="text-4xl font-bold text-white mb-2">FULL MOCK 12</h3>
                            <p className="text-zinc-400 font-mono text-sm">Scheduled: Today, 6:00 PM</p>
                        </div>

                        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-4 text-lg mt-4 shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2">
                            START BATTLE <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Widget 2: Streak / Daily Target (CLICKABLE) */}
                    <div
                        onClick={onOpenDailyInsights}
                        className="md:col-span-1 bg-zinc-900 border-2 border-zinc-800 shadow-[5px_5px_0px_0px_#27272a] p-6 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:border-zinc-500 transition-colors group"
                    >
                        <div className="absolute top-2 right-2 flex gap-1">
                            {[1, 1, 1, 1, 0].map((d, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${d ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                            ))}
                        </div>

                        <div className="relative w-24 h-24 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="#27272a" strokeWidth="8" fill="none" />
                                <circle cx="48" cy="48" r="40" stroke="#eab308" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="60" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-2xl font-bold">75%</span>
                        </div>
                        <div className="text-center group-hover:text-white text-zinc-300 transition-colors">
                            <p className="text-xs text-zinc-500 uppercase font-mono group-hover:text-zinc-400">Daily Target</p>
                            <p className="font-bold text-lg">35/40 Qs</p>
                            <span className="text-[10px] text-emerald-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">CLICK FOR INSIGHTS</span>
                        </div>
                    </div>

                    {/* Widget 3: Resume Prep */}
                    <div className="md:col-span-1 bg-zinc-900 border-2 border-zinc-800 shadow-[5px_5px_0px_0px_#27272a] p-6 flex flex-col justify-between">
                        <div className="bg-indigo-500/10 w-fit p-2 rounded border border-indigo-500/20">
                            <BookOpen className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 mb-1 font-mono">LAST ACTIVE</p>
                            <h4 className="text-lg font-bold text-indigo-400">Geometry: Circles</h4>
                            <div className="w-full bg-zinc-800 h-1 mt-2">
                                <div className="bg-indigo-500 h-1 w-2/3"></div>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-zinc-300 hover:text-white self-end flex items-center gap-1">
                            RESUME <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Widget 4: Weakness Alert */}
                    <div className="md:col-span-1 bg-zinc-900 border-2 border-red-900/50 shadow-[5px_5px_0px_0px_#27272a] p-6 relative">
                        <div className="absolute top-0 right-0 p-2">
                            <div className="animate-pulse bg-red-500/20 p-1 rounded-full">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                            </div>
                        </div>
                        <h4 className="text-red-400 font-bold mb-2">CRITICAL DROP</h4>
                        <p className="text-3xl font-bold mb-1">42%</p>
                        <p className="text-zinc-500 text-xs mb-4">Algebra accuracy dropped significantly in last 2 mocks.</p>
                        <button className="w-full py-1 text-xs border border-red-900 text-red-500 hover:bg-red-950">
                            FIX NOW
                        </button>
                    </div>

                    {/* Widget 5: Quick Links */}
                    <div className="md:col-span-1 bg-zinc-900 border-2 border-zinc-800 shadow-[5px_5px_0px_0px_#27272a] p-4 flex flex-col gap-2 justify-center">
                        <QuickLinkButton label="VARC Sectional" color="text-emerald-400" />
                        <QuickLinkButton label="DILR Sectional" color="text-yellow-400" />
                        <QuickLinkButton label="QA Sectional" color="text-indigo-400" />
                    </div>

                </div>
            </section>

            {/* SECTION B: ANALYTICS DASHBOARD */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                        <Activity className="text-indigo-400" />
                        Performance Analytics
                    </h2>

                    {/* TOGGLE BUTTONS */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAnalyticsType('full')}
                            className={`px-4 py-1 text-sm font-bold border-2 transition-all ${analyticsType === 'full'
                                ? 'bg-red-600 border-red-600 text-white shadow-[3px_3px_0px_0px_#fff]'
                                : 'bg-transparent border-zinc-700 text-zinc-500 hover:border-zinc-500'
                                }`}
                        >
                            FULL MOCKS
                        </button>
                        <button
                            onClick={() => setAnalyticsType('sectional')}
                            className={`px-4 py-1 text-sm font-bold border-2 transition-all ${analyticsType === 'sectional'
                                ? 'bg-red-600 border-red-600 text-white shadow-[3px_3px_0px_0px_#fff]'
                                : 'bg-transparent border-zinc-700 text-zinc-500 hover:border-zinc-500'
                                }`}
                        >
                            SECTIONAL MOCKS
                        </button>
                    </div>
                </div>

                {analyticsType === 'full' ? (
                    /* FULL MOCKS VIEW */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Chart 1: Score Trajectory */}
                        <div className="md:col-span-2 bg-zinc-900 border-2 border-zinc-800 shadow-[5px_5px_0px_0px_#27272a] p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                                Score Trajectory
                                <span className="text-xs font-mono text-emerald-400">+12% vs last month</span>
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceData}>
                                        <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                            itemStyle={{ color: '#22c55e' }}
                                            cursor={{ stroke: '#3f3f46' }}
                                        />
                                        <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#09090b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Chart 2: Spider Chart */}
                        <div className="md:col-span-1 bg-zinc-900 border-2 border-zinc-800 shadow-[5px_5px_0px_0px_#27272a] p-6">
                            <h3 className="text-lg font-bold mb-4">Proficiency Radar</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectData}>
                                        <PolarGrid stroke="#3f3f46" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Proficiency" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.3} />
                                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Stat Cards Row */}
                        <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <StatCard label="Avg Time/Q" value="1m 42s" icon={TrendingUp} diff="-5s" good={true} />
                            <StatCard label="Accuracy" value="78%" icon={Target} diff="+2%" good={true} />
                            <StatCard label="Percentile" value="94.5" icon={Award} diff="+1.2" good={true} />
                            <StatCard label="Modules" value="12/45" icon={BookOpen} />
                        </div>
                    </div>
                ) : (
                    /* SECTIONAL MOCKS VIEW (Flowing Tree) */
                    <div className="grid grid-cols-3 gap-8 relative">
                        {/* Connector Lines (Visual) */}
                        <div className="absolute top-12 left-0 w-full h-1 bg-zinc-800/50 -z-10" />

                        {/* SECTION 1: VARC */}
                        <SectionColumn
                            title="VARC"
                            color="emerald"
                            data={[
                                { label: "RC Inference", score: 85 },
                                { label: "Parajumbles", score: 60 },
                                { label: "Summary", score: 92 },
                            ]}
                        />

                        {/* SECTION 2: DILR */}
                        <SectionColumn
                            title="DILR"
                            color="yellow"
                            data={[
                                { label: "Arrangements", score: 70 },
                                { label: "Games", score: 45 },
                                { label: "Charts", score: 88 },
                            ]}
                        />

                        {/* SECTION 3: QA */}
                        <SectionColumn
                            title="QA"
                            color="indigo"
                            data={[
                                { label: "Algebra", score: 42 },
                                { label: "Arithmetic", score: 78 },
                                { label: "Geometry", score: 65 },
                            ]}
                        />
                    </div>
                )}
            </section>
        </div>
    );
}

function SectionColumn({ title, color, data }) {
    const colorClasses = {
        emerald: "text-emerald-400 border-emerald-500/30",
        yellow: "text-yellow-400 border-yellow-500/30",
        indigo: "text-indigo-400 border-indigo-500/30",
    };

    return (
        <div className="flex flex-col gap-4">
            <div className={`p-4 bg-zinc-900 border-2 ${colorClasses[color]} text-center shadow-[4px_4px_0px_0px_#27272a]`}>
                <h3 className={`text-xl font-bold font-mono ${colorClasses[color].split(' ')[0]}`}>{title}</h3>
            </div>

            {/* Flowing Items */}
            {data.map((item, idx) => (
                <div key={idx} className="relative group">
                    {/* Vertical Connector */}
                    <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-zinc-800 -z-10" />

                    <div className="bg-zinc-950 border border-zinc-800 p-3 hover:border-zinc-600 transition-colors shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-zinc-400 font-bold">{item.label}</span>
                            <span className={`text-xs font-mono ${item.score < 50 ? 'text-red-400' : 'text-white'}`}>{item.score}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-indigo-500'}`}
                                style={{ width: `${item.score}%` }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function StatCard({ label, value, icon: Icon, diff, good }) {
    return (
        <div className="bg-zinc-900 border-2 border-zinc-800 p-4 relative group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-2">
                <p className="text-zinc-500 text-xs font-mono uppercase">{label}</p>
                <Icon className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            {diff && (
                <span className={`text-xs font-bold ${good ? 'text-emerald-500' : 'text-red-500'}`}>
                    {diff}
                </span>
            )}
        </div>
    );
}

function QuickLinkButton({ label, color }) {
    return (
        <button className="flex items-center justify-between w-full p-2 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-colors group">
            <span className={`text-sm font-bold ${color}`}>{label}</span>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
        </button>
    );
}


