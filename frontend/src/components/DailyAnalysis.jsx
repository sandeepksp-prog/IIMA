import React, { useState } from 'react';
import {
    Calendar, ArrowLeft, Target, Clock, Brain, Activity,
    ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle
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

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-zinc-950 p-6 text-zinc-50 font-sans">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 border-b-2 border-zinc-800 pb-6">
                <button
                    onClick={onBack}
                    className="p-2 border-2 border-zinc-700 hover:bg-zinc-800 transition-colors rounded shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none bg-zinc-900"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2">
                        <span className="bg-indigo-500 text-black px-2 shadow-[4px_4px_0px_0px_#27272a]">DAILY</span>
                        REPORT
                    </h1>
                    <p className="text-zinc-400 font-mono mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                {/* 1. TOP STATS (Full Width) */}
                <div className="lg:col-span-3 bg-zinc-900 border-2 border-zinc-800 p-6 shadow-[5px_5px_0px_0px_#27272a] flex flex-wrap justify-around items-center gap-4">
                    <StatItem icon={Target} label="Questions Solved" value={`${TOP_STATS.totalSolved}/${TOP_STATS.target}`} />
                    <div className="h-12 w-0.5 bg-zinc-800 hidden md:block" />
                    <StatItem icon={Clock} label="Time Spent" value={TOP_STATS.timeSpent} />
                    <div className="h-12 w-0.5 bg-zinc-800 hidden md:block" />
                    <StatItem icon={Activity} label="Overall Accuracy" value={TOP_STATS.accuracy} />
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
                            <h3 className={`text-2xl font-bold ${data.color}`}>{key}</h3>
                            {expandedSection === key ? <ChevronUp className="text-zinc-500" /> : <ChevronDown className="text-zinc-500" />}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-mono text-zinc-400">
                                <span>Progress</span>
                                <span>{data.solved}/{data.target}</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                                <div
                                    className={`h-full ${data.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${(data.solved / data.target) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* EXPANDED INSIGHTS */}
                        {expandedSection === key && (
                            <div className="mt-6 pt-6 border-t border-zinc-700 animate-in fade-in slide-in-from-top-2 duration-200">
                                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                                    <Brain className="w-4 h-4" /> Small Insights
                                </h4>
                                <ul className="space-y-2 text-xs text-zinc-300 font-mono">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-emerald-500" /> Strong in RC
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <XCircle className="w-3 h-3 text-red-500" /> Weak in PJ
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-yellow-500" /> Avg Time: 2m/Q
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ))}

                {/* 3. INSIGHTS GRID (Bottom) */}

                {/* Graph: Question Types */}
                <div className="lg:col-span-2 bg-zinc-900 border-2 border-zinc-800 p-6 shadow-[5px_5px_0px_0px_#27272a]">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Activity className="text-emerald-400" />
                        Distribution by Topic
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={QUESTION_TYPE_DATA}>
                                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                    cursor={{ fill: '#27272a' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {QUESTION_TYPE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Struggle Analysis */}
                <div className="lg:col-span-1 bg-zinc-900 border-2 border-red-900/30 p-6 shadow-[5px_5px_0px_0px_#27272a]">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-400">
                        <AlertCircle />
                        Struggle Analysis
                    </h3>
                    <div className="space-y-4">
                        {STRUGGLE_DATA.map((item, idx) => (
                            <div key={idx} className="bg-zinc-950 p-3 border border-zinc-800 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm">{item.type}</p>
                                    <p className="text-xs text-zinc-500 font-mono">{item.issue}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-400">{item.value}</p>
                                    <span className="text-[10px] bg-red-900/20 text-red-500 px-1 rounded uppercase">{item.severity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded">
                        <p className="text-xs text-indigo-300">
                            <strong>AI Suggestion:</strong> Focus on Algebra basics. You are spending too much time thinking before starting the solution.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-800 rounded-full">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="text-xs text-zinc-500 font-mono uppercase">{label}</p>
                <p className="text-2xl font-black">{value}</p>
            </div>
        </div>
    );
}
