import React, { useState } from 'react';
import {
    Calendar, ArrowLeft, Target, Clock, Brain, Activity,
    ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle, Zap, Shield, Flame
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

// --- Dummy Data ---
const TOP_STATS = {
    totalSolved: 35,
    target: 40,
    timeSpent: "2h 15m",
    accuracy: "78%"
};

const SECTION_BREAKDOWN = {
    VARC: { solved: 12, target: 15, accuracy: 85, color: "text-emerald-400" },
    DILR: { solved: 8, target: 10, accuracy: 65, color: "text-yellow-400" },
    QA: { solved: 15, target: 15, accuracy: 80, color: "text-indigo-400" }
};

const STRUGGLE_DATA = [
    { type: 'Algebra (QA)', issue: 'Time Wasted', value: '12m', severity: 'High' },
    { type: 'RC Inference', issue: 'Accuracy', value: '40%', severity: 'Med' },
    { type: 'Arrangements', issue: 'Thinking', value: '8m', severity: 'High' }
];

const QUESTION_TYPE_DATA = [
    { name: 'Arithmetic', value: 10 },
    { name: 'Algebra', value: 5 },
    { name: 'Geometry', value: 3 },
    { name: 'RC', value: 12 },
    { name: 'LR', value: 8 }
];
const COLORS = ['#818cf8', '#34d399', '#facc15', '#f87171', '#fb923c'];

export default function DailyAnalysis({ onBack }) {
    const [expandedSection, setExpandedSection] = useState(null);
    const [strategyMode, setStrategyMode] = useState('war'); // 'war' (Aggressive) | 'balanced' (Normal)

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-zinc-950 p-6 text-zinc-50 font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b-2 border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 border-2 border-zinc-700 hover:bg-zinc-800 transition-colors rounded shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none bg-zinc-900"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-2 tracking-tighter">
                            <span className="bg-indigo-500 text-black px-2 shadow-[4px_4px_0px_0px_#27272a] italic">DAILY</span>
                            REPORT
                        </h1>
                        <p className="text-zinc-400 font-mono mt-1 flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Strategy Toggle */}
                <div className="flex bg-zinc-900 border-2 border-zinc-800 p-1 shadow-[4px_4px_0px_0px_#27272a]">
                    <button
                        onClick={() => setStrategyMode('balanced')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all ${strategyMode === 'balanced'
                            ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Shield className="w-4 h-4" /> BALANCED
                    </button>
                    <button
                        onClick={() => setStrategyMode('war')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all ${strategyMode === 'war'
                            ? 'bg-red-900/20 text-red-500 shadow-sm border border-red-900/50'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Flame className="w-4 h-4" /> WAR MODE
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                {/* 1. TOP STATS (Full Width) */}
                <div className="lg:col-span-3 bg-zinc-900 border-2 border-zinc-800 p-6 shadow-[5px_5px_0px_0px_#27272a] flex flex-wrap justify-around items-center gap-4 relative overflow-hidden group">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target className="w-32 h-32" />
                    </div>

                    <StatItem icon={Target} label="Questions Solved" value={`${TOP_STATS.totalSolved}/${TOP_STATS.target}`}
                        trend={strategyMode === 'war' && "LAGGING"} trendColor="text-red-500" />
                    <div className="h-12 w-0.5 bg-zinc-800 hidden md:block" />
                    <StatItem icon={Clock} label="Time Spent" value={TOP_STATS.timeSpent} />
                    <div className="h-12 w-0.5 bg-zinc-800 hidden md:block" />
                    <StatItem icon={Activity} label="Overall Accuracy" value={TOP_STATS.accuracy}
                        trend="+2%" trendColor="text-emerald-500" />
                </div>

                {/* 2. SECTION BREAKDOWN (3 Columns) */}
                {Object.entries(SECTION_BREAKDOWN).map(([key, data]) => (
                    <div
                        key={key}
                        onClick={() => toggleSection(key)}
                        className={`
                            border-2 p-6 cursor-pointer transition-all relative overflow-hidden group
                            ${expandedSection === key
                                ? 'bg-zinc-800 border-indigo-500 shadow-none translate-x-[2px] translate-y-[2px]'
                                : 'bg-zinc-900 border-zinc-800 shadow-[5px_5px_0px_0px_#27272a] hover:border-zinc-600'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className={`text-2xl font-black tracking-tight ${data.color}`}>{key}</h3>
                            {expandedSection === key ? <ChevronUp className="text-zinc-500" /> : <ChevronDown className="text-zinc-500" />}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-mono text-zinc-400">
                                <span className="uppercase text-xs font-bold">Progress</span>
                                <span>{data.solved}/{data.target}</span>
                            </div>
                            <div className="w-full h-3 bg-zinc-950 border border-zinc-800 relative">
                                <div
                                    className={`h-full ${data.color.replace('text-', 'bg-')} transition-all duration-500`}
                                    style={{ width: `${(data.solved / data.target) * 100}%` }}
                                />
                                {/* Marker for target if needed */}
                            </div>
                        </div>

                        {/* EXPANDED INSIGHTS */}
                        {expandedSection === key && (
                            <div className="mt-6 pt-6 border-t border-zinc-700 animate-in fade-in slide-in-from-top-2 duration-200">
                                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 uppercase tracking-wider text-zinc-500">
                                    <Brain className="w-4 h-4" /> Micro-Analysis
                                </h4>
                                <ul className="space-y-3 text-xs text-zinc-300 font-mono">
                                    <li className="flex items-center gap-3 p-2 bg-zinc-950/50 border border-zinc-800/50">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>Strong in <span className="text-white font-bold">RC Inference</span> (90% Acc)</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-2 bg-zinc-950/50 border border-zinc-800/50">
                                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                        <span>Weak in <span className="text-white font-bold">Parajumbles</span> (45% Acc)</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-2 bg-zinc-950/50 border border-zinc-800/50">
                                        <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                                        <span>Avg Time: <span className="text-white font-bold">2m 12s</span> / Q</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ))}

                {/* 3. INSIGHTS GRID (Bottom) */}

                {/* Graph: Question Types */}
                <div className="lg:col-span-2 bg-zinc-900 border-2 border-zinc-800 p-6 shadow-[5px_5px_0px_0px_#27272a]">
                    <h3 className="font-bold text-lg mb-6 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Activity className="text-emerald-400" />
                            TOPIC VELOCITY
                        </span>
                        <span className="text-xs font-mono text-zinc-500 uppercase border border-zinc-700 px-2 py-1 rounded">Last 24 Hours</span>
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={QUESTION_TYPE_DATA}>
                                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#27272a' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-zinc-900 border border-zinc-700 p-2 shadow-xl">
                                                    <p className="font-bold text-white mb-1">{payload[0].payload.name}</p>
                                                    <p className="text-xs text-emerald-400 font-mono">
                                                        {payload[0].value} Questions
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                                    {QUESTION_TYPE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Struggle Analysis */}
                <div className={`lg:col-span-1 border-2 p-6 shadow-[5px_5px_0px_0px_#27272a] transition-colors duration-500
                    ${strategyMode === 'war' ? 'bg-red-950/10 border-red-500/50' : 'bg-zinc-900 border-zinc-800'}`}>

                    <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${strategyMode === 'war' ? 'text-red-500 animate-pulse' : 'text-red-400'}`}>
                        <AlertCircle />
                        CRITICAL STRUGGLES
                    </h3>

                    <div className="space-y-4">
                        {STRUGGLE_DATA.map((item, idx) => (
                            <div key={idx} className={`p-3 border flex justify-between items-center transition-all
                                ${item.severity === 'High' && strategyMode === 'war' ? 'animate-pulse bg-red-900/20 border-red-500/50' : 'bg-zinc-950 border-zinc-800'}
                            `}>
                                <div>
                                    <p className="font-bold text-sm text-zinc-200">{item.type}</p>
                                    <p className="text-xs text-zinc-500 font-mono uppercase">{item.issue}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-400">{item.value}</p>
                                    <span className={`text-[10px] px-1 uppercase font-bold
                                        ${item.severity === 'High' ? 'text-red-500' : 'text-yellow-500'}
                                    `}>{item.severity}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`mt-6 p-4 border rounded relative overflow-hidden
                        ${strategyMode === 'war'
                            ? 'bg-red-900/20 border-red-500/30'
                            : 'bg-indigo-500/10 border-indigo-500/20'}
                    `}>
                        <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-50"></div>
                        <p className={`text-xs font-mono leading-relaxed
                            ${strategyMode === 'war' ? 'text-red-300' : 'text-indigo-300'}
                        `}>
                            <strong>{strategyMode === 'war' ? '🛑 WAR ROOM DIRECTIVE:' : '💡 AI SUGGESTION:'}</strong>
                            <br />
                            {strategyMode === 'war'
                                ? "IMMEDIATE HALT on Algebra. You are bleeding time. Switch to Arithmetic drills for 45m. IGNORE new topics."
                                : "Focus on Algebra basics. You are spending too much time thinking before starting the solution."
                            }
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatItem({ icon: Icon, label, value, trend, trendColor }) {
    return (
        <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-800 border border-zinc-700 shadow-sm rotate-3 hover:rotate-0 transition-transform duration-300">
                <Icon className="w-6 h-6 text-zinc-100" />
            </div>
            <div>
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{label}</p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-black leading-none">{value}</p>
                    {trend && <span className={`text-xs font-bold mb-1 ${trendColor}`}>{trend}</span>}
                </div>
            </div>
        </div>
    );
}
