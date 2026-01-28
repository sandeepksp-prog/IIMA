import React, { useState, useEffect } from 'react';
import {
    Calendar, Trophy, Flame, Target, Clock, Filter,
    ArrowRight, CheckCircle2, XCircle, Brain,
    ChevronDown, BarChart2, Zap, Crown, Ghost, Crosshair,
    Play, Search, ChevronRight, User, MousePointer2, ChevronUp
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

// --- REF DATA & LOGIC ---
const CAT_DATE = new Date('2026-11-29T00:00:00'); // CAT 2026 Date

// Mock Analytics Data (Restored richness with Date/Score/Accuracy + Sectional Breakdown)
const RAW_ANALYTICS_DATA = [
    { date: '24 Jan', score: 30, accuracy: 60, varc: 10, dilr: 10, qa: 10 },
    { date: '25 Jan', score: 45, accuracy: 75, varc: 15, dilr: 15, qa: 15 },
    { date: '26 Jan', score: 40, accuracy: 70, varc: 20, dilr: 10, qa: 10 }, // Score dip
    { date: '27 Jan', score: 55, accuracy: 80, varc: 10, dilr: 25, qa: 20 }, // New High
    { date: '28 Jan', score: 50, accuracy: 82, varc: 20, dilr: 10, qa: 20 },
    { date: '29 Jan', score: 65, accuracy: 85, varc: 25, dilr: 20, qa: 20 }, // New High
    { date: '30 Jan', score: 62, accuracy: 88, varc: 20, dilr: 22, qa: 20 }
];

// Helper to calculate Stagnant Top Score
const getProcessedGraphData = () => {
    let maxScore = 0;
    return RAW_ANALYTICS_DATA.map(item => {
        maxScore = Math.max(maxScore, item.score);
        return {
            ...item,
            topScore: maxScore
        };
    });
};

const GRAPH_DATA = getProcessedGraphData();

// DATA SOURCE: analyticsMasterData.js (Structure flattened for Drilldown)
const SYLLABUS_DRILLDOWN = {
    'Quant': [
        { name: 'Arithmetic', progress: 85 },
        { name: 'Algebra', progress: 55 },
        { name: 'Geometry', progress: 70 },
        { name: 'Number System', progress: 90 },
        { name: 'Modern Math', progress: 40 }
    ],
    'VARC': [
        { name: 'Reading Comprehension', progress: 82 },
        { name: 'Verbal Ability', progress: 75 },
        { name: 'Critical Reasoning', progress: 60 },
        { name: 'Para Jumbles', progress: 45 },
        { name: 'Para Summary', progress: 70 }
    ],
    'LRDI': [
        { name: 'Logical Reasoning', progress: 65 },
        { name: 'Data Interpretation', progress: 82 },
        { name: 'Arrangements', progress: 80 },
        { name: 'Games/Tournaments', progress: 50 },
        { name: 'Charts & Graphs', progress: 90 }
    ]
};

const REPO_TESTS = [
    { id: 101, subject: 'Quant', topic: 'Arithmetic', title: 'Time & Work Drill', score: 3, max: 5, status: 'completed', date: '2026-01-25' },
    { id: 102, subject: 'LRDI', topic: 'Logical Reasoning', title: 'Laptop Sales Distribution', score: null, max: 15, status: 'new', date: '2026-01-26' },
    { id: 103, subject: 'VARC', topic: 'Reading Comprehension', title: 'Turing Test Philosophy', score: null, max: 12, status: 'new', date: '2026-01-27' },
    { id: 104, subject: 'Quant', topic: 'Number System', title: 'Decreasing Digits Count', score: null, max: 5, status: 'new', date: '2026-01-27' },
    { id: 105, subject: 'VARC', topic: 'Verbal Ability', title: 'Power of Awe (Para Summary)', score: null, max: 12, status: 'new', date: '2026-01-28' },
    { id: 106, subject: 'LRDI', topic: 'Data Interpretation', title: 'Variable Payoffs (Games)', score: null, max: 15, status: 'new', date: '2026-01-28' },
    { id: 107, subject: 'Quant', topic: 'Algebra', title: 'Quadratic Roots', score: 5, max: 5, status: 'completed', date: '2026-01-24' },
];

const DAILY_MOCK_CONTENT = {
    date: 'Jan 28',
    title: 'Focus: Arithmetic & Inference',
    sections: [
        { subject: 'Quant', icon: 'Q', color: 'orange', count: '5 Qs', detail: 'Arithmetic (Time & Work, %)' },
        { subject: 'LRDI', icon: 'L', color: 'emerald', count: '1 Set', detail: 'Distribution (Linear)' },
        { subject: 'VARC', icon: 'V', color: 'indigo', count: '5 Qs', detail: 'RC (Science) + 1 VA' }
    ],
    est_time: '40m',
    total_q: 15
};

// --- SUB-COMPONENTS ---

// 1. REFINED PROFILE (V5: Tighter Spacing & Dynamic Rank)
const ProfileCompact = ({ selectedDate, onSelectDate }) => {
    // Generate dates (Ref: Image uploaded_media_1769580424998.png)
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 3 + i);
        return {
            date: d.getDate(),
            day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            fullDate: d,
            isToday: i === 3,
            status: i < 3 ? 'completed' : i === 3 ? 'pending' : 'future',
            score: i < 3 ? Math.floor(Math.random() * 20) + 10 : 0
        };
    });

    // Rank Logic V5
    // Progress = (Syllabus% * 0.7) + (TimeDecay * 0.3)
    const syllabusComp = 0.35; // 35%
    const totalDays = 600;
    const daysLeft = 304;
    const timeFactor = 1 - (daysLeft / totalDays);
    const rankXP = Math.floor((syllabusComp * 0.7 + timeFactor * 0.3) * 1000); // ~ 400-500
    const nextRankXP = 1000;
    const progressPercent = (rankXP / nextRankXP) * 100;

    return (
        <div className="bg-zinc-950/80 border border-zinc-800 p-5 rounded-3xl h-full flex flex-col justify-between shadow-2xl min-h-[400px]">
            <div>
                {/* Header Profile */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border-2 border-emerald-500/30 relative">
                        <User size={32} className="text-zinc-400" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                            <Zap size={10} className="text-black fill-current" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Sandeep</h3>
                        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded px-2 py-0.5 mt-1 inline-block">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                Season XP: {rankXP}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Rank Progress Bar */}
                <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/50">
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Rank Progress</span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">{nextRankXP - rankXP} XP to 'Elite'</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Middle: BRIGHT FOCUS CARD (Fills Space) */}
            <div className="flex-1 flex flex-col justify-center py-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.3)] group h-full max-h-[140px]">

                    {/* Decorative Particles */}
                    <div className="absolute top-0 right-0 p-4 opacity-30">
                        <Target size={60} className="text-white rotate-12" />
                    </div>

                    <div>
                        <div className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-1">Daily Focus</div>
                        <div className="text-2xl font-black text-white leading-none tracking-tight break-words w-[80%]">
                            CRUSH THE <br /> ARITHMETIC
                        </div>
                    </div>

                    <div className="mt-auto flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white">
                            Streak: 4 Days
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white">
                            Best: 12
                        </div>
                    </div>
                </div>
            </div>

            {/* Dates Row (Enhanced Animation) */}
            <div className="grid grid-cols-7 gap-2 mt-auto">
                {dates.map((item, idx) => {
                    const isSelected = selectedDate === item.date;
                    return (
                        <button
                            key={idx}
                            onClick={() => onSelectDate(item.date)}
                            className="flex flex-col items-center gap-2 group relative"
                        >
                            {/* Selected Indicator - The 'Green Animation' */}
                            {isSelected && (
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg scale-150 animate-pulse"></div>
                            )}

                            <span className={`text-[9px] font-bold uppercase transition-colors relative z-10 ${isSelected ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-500'}`}>{item.day}</span>

                            <div className={`w-9 h-9 flex items-center justify-center text-sm font-bold rounded-full border-2 transition-all duration-300 relative z-10
                                 ${isSelected
                                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110'
                                    : item.status === 'completed'
                                        ? 'border-emerald-900/50 text-emerald-800 bg-emerald-900/10'
                                        : 'border-zinc-800 text-zinc-700 bg-zinc-900 group-hover:border-zinc-700'}
                            `}>
                                {item.date}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

// 2. DAILY MOCK PROTOCOL (V5)
const DailyMockHero = ({ date, onStart }) => (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-0 rounded-3xl h-full flex flex-col shadow-2xl relative overflow-hidden group min-h-[400px]">

        {/* Header */}
        <div className="p-8 border-b border-zinc-800/50 flex justify-between items-start bg-zinc-900/30">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                        Protocol Active
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500">Jan {date}</span>
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Daily Run V5</h2>
            </div>
            <div className="text-right">
                <div className="text-4xl font-black text-white tabular-nums leading-none">15</div>
                <div className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Questions</div>
            </div>
        </div>

        {/* Body */}
        <div className="p-8 flex-1 flex flex-col justify-center space-y-4">
            {DAILY_MOCK_CONTENT.sections.map((sec, i) => (
                <div key={i} className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border
                        ${sec.subject === 'Quant' ? 'bg-orange-950/20 text-orange-500 border-orange-500/20' :
                            sec.subject === 'LRDI' ? 'bg-emerald-950/20 text-emerald-500 border-emerald-500/20' :
                                'bg-indigo-950/20 text-indigo-500 border-indigo-500/20'}`}>
                        {sec.icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-zinc-300">{sec.detail}</span>
                            <span className="text-[10px] font-black text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 uppercase">{sec.count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div className={`h-full w-[80%] rounded-full opacity-60 ${sec.color === 'orange' ? 'bg-orange-500' : sec.color === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer Action */}
        <div className="p-8 pt-0 mt-auto">
            <button
                onClick={onStart} // Triggers Popup
                className="w-full py-5 bg-white hover:bg-zinc-200 text-black text-sm font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 hover:scale-[1.01]">
                <Play size={18} className="fill-black" /> Initialize Test
            </button>
        </div>
    </div>
);

// 3. STATS COLUMN (V5: Countdown + Performance 3D Pie Chart)
const StatsColumn = () => {
    // Logic: Time Left (Target Nov 29, 2026)
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const target = new Date('2026-11-29T00:00:00');
        const now = new Date();
        const diff = target - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setDaysLeft(days);
    }, []);

    // Calculate Average Sectional Contribution
    const totalDays = RAW_ANALYTICS_DATA.length || 1;
    const avgVarc = Math.round(RAW_ANALYTICS_DATA.reduce((acc, curr) => acc + curr.varc, 0) / totalDays);
    const avgDilr = Math.round(RAW_ANALYTICS_DATA.reduce((acc, curr) => acc + curr.dilr, 0) / totalDays);
    const avgQa = Math.round(RAW_ANALYTICS_DATA.reduce((acc, curr) => acc + curr.qa, 0) / totalDays);
    const totalAvg = avgVarc + avgDilr + avgQa;

    const pieData = [
        { name: 'VARC', value: avgVarc, color: '#6366f1', gradient: 'url(#gradVarc)' },
        { name: 'LRDI', value: avgDilr, color: '#10b981', gradient: 'url(#gradDilr)' },
        { name: 'QUANT', value: avgQa, color: '#f97316', gradient: 'url(#gradQa)' }
    ];

    return (
        <div className="flex flex-col gap-6 h-full min-h-[400px]">
            {/* Countdown */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex-col items-center justify-center relative overflow-hidden flex-shrink-0 min-h-[160px] flex shadow-lg">
                <div className="absolute top-4 left-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Countdown</div>
                <div className="relative w-24 h-24 flex items-center justify-center mt-2">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="42" stroke="#18181b" strokeWidth="8" fill="none" />
                        <circle cx="48" cy="48" r="42" stroke="#ffffff" strokeWidth="8" fill="none" strokeDasharray="4 2" strokeDashoffset="40" className="opacity-20" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white tracking-tighter leading-none">{daysLeft}</span>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase mt-1">Days</span>
                    </div>
                </div>
            </div>

            {/* Performance Loop (3D Donut) */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex-1 flex flex-col min-h-[220px] shadow-lg relative overflow-hidden group">
                <div className="flex justify-between items-center mb-2 z-10 relative">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Performance Loop</span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">AVG: {totalAvg}</span>
                </div>

                <div className="flex-1 w-full relative h-[300px] flex items-center justify-center -mt-4">
                    {/* CUSTOM SVG ISOMETRIC PIE (Clean - No Labels) */}
                    <svg viewBox="-180 -90 360 180" className="w-full h-full drop-shadow-2xl">
                        <defs>
                            {/* Gradients for Side Walls (Darker) */}
                            <linearGradient id="gradIndigoDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4338ca" /><stop offset="100%" stopColor="#312e81" /></linearGradient>
                            <linearGradient id="gradEmeraldDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#064e3b" /></linearGradient>
                            <linearGradient id="gradOrangeDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ea580c" /><stop offset="100%" stopColor="#7c2d12" /></linearGradient>

                            {/* Gradients for Top Face (Lighter/Vibrant) */}
                            <linearGradient id="gradIndigo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#4f46e5" /></linearGradient>
                            <linearGradient id="gradEmerald" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
                            <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fb923c" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
                        </defs>
                        <g transform="translate(0, 15)">
                            {(() => {
                                // 1. Prepare Data
                                let rawData = [
                                    { value: avgVarc, color: "url(#gradIndigo)", sideColor: "url(#gradIndigoDark)", label: "VARC" },
                                    { value: avgDilr, color: "url(#gradEmerald)", sideColor: "url(#gradEmeraldDark)", label: "LRDI" },
                                    { value: avgQa, color: "url(#gradOrange)", sideColor: "url(#gradOrangeDark)", label: "QA" }
                                ];
                                const total = rawData.reduce((sum, d) => sum + d.value, 0) || 1;

                                // 2. Calculate Angles
                                let currentAngle = 0;
                                const radius = 150; // MAXIMIZED
                                const innerRadius = 80;
                                const height = 30;

                                const slices = rawData.map(d => {
                                    const percentage = d.value / total;
                                    const angleSearch = percentage * Math.PI * 2;
                                    const start = currentAngle;
                                    const end = currentAngle + angleSearch;
                                    const mid = start + angleSearch / 2;
                                    currentAngle += angleSearch;

                                    const distFromBack = Math.abs(mid - (3 * Math.PI / 2));

                                    return { ...d, start, end, mid, percentage, distFromBack };
                                });

                                // 3. Sort Slices (Back to Front)
                                slices.sort((a, b) => Math.sin(a.mid) - Math.sin(b.mid));

                                return slices.map((slice, i) => {
                                    // Coordinates
                                    const sx = Math.cos(slice.start) * radius;
                                    const sy = Math.sin(slice.start) * radius * 0.6;
                                    const ex = Math.cos(slice.end) * radius;
                                    const ey = Math.sin(slice.end) * radius * 0.6;

                                    const isx = Math.cos(slice.start) * innerRadius;
                                    const isy = Math.sin(slice.start) * innerRadius * 0.6;
                                    const iex = Math.cos(slice.end) * innerRadius;
                                    const iey = Math.sin(slice.end) * innerRadius * 0.6;

                                    const largeArc = (slice.end - slice.start) > Math.PI ? 1 : 0;

                                    // Outer Wall
                                    const outerWallPath = `
                                        M ${ex} ${ey} 
                                        L ${ex} ${ey + height} 
                                        A ${radius} ${radius * 0.6} 0 ${largeArc} 0 ${sx} ${sy + height}
                                        L ${sx} ${sy} 
                                        A ${radius} ${radius * 0.6} 0 ${largeArc} 1 ${ex} ${ey} 
                                        Z
                                    `;

                                    // Inner Wall
                                    const innerWallPath = `
                                        M ${isx} ${isy} 
                                        L ${isx} ${isy + height} 
                                        A ${innerRadius} ${innerRadius * 0.6} 0 ${largeArc} 1 ${iex} ${iey + height} 
                                        L ${iex} ${iey} 
                                        A ${innerRadius} ${innerRadius * 0.6} 0 ${largeArc} 0 ${isx} ${isy} 
                                        Z
                                    `;

                                    // Top Face
                                    const topPath = `
                                        M ${sx} ${sy}
                                        A ${radius} ${radius * 0.6} 0 ${largeArc} 1 ${ex} ${ey}
                                        L ${iex} ${iey}
                                        A ${innerRadius} ${innerRadius * 0.6} 0 ${largeArc} 0 ${isx} ${isy}
                                        Z
                                    `;

                                    return (
                                        <g key={i}>
                                            <path d={innerWallPath} fill={slice.sideColor} filter="brightness(0.6)" stroke="none" />
                                            <path d={outerWallPath} fill={slice.sideColor} stroke="none" />
                                            <path d={topPath} fill={slice.color} stroke="none" />
                                        </g>
                                    );
                                });
                            })()}
                        </g>
                    </svg>
                </div>

                {/* LEGEND ROW */}
                <div className="flex justify-between items-center px-4 pb-4">
                    {/* QA */}
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold text-white">{Math.round((avgQa / totalAvg) * 100)}%</span>
                            <span className="text-[10px] font-semibold text-zinc-500">QA</span>
                        </div>
                    </div>
                    {/* LRDI */}
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold text-white">{Math.round((avgDilr / totalAvg) * 100)}%</span>
                            <span className="text-[10px] font-semibold text-zinc-500">LRDI</span>
                        </div>
                    </div>
                    {/* VARC */}
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold text-white">{Math.round((avgVarc / totalAvg) * 100)}%</span>
                            <span className="text-[10px] font-semibold text-zinc-500">VARC</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. ANALYTICS (Refined V5 Logic)
const AnalyticsSection = () => {
    const [expandedSubject, setExpandedSubject] = useState('Quant');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
            {/* SCORE & TOP SCORE TRACKER */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-sm font-bold text-zinc-300 mb-6 flex items-center gap-2">
                    <BarChart2 size={16} className="text-emerald-500" /> Performance Analysis
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={GRAPH_DATA}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} />
                            <YAxis yAxisId="left" hide domain={[0, 100]} />
                            <YAxis yAxisId="right" orientation="right" hide domain={[0, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} />

                            {/* Daily Score Area */}
                            <Area yAxisId="left" type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" name="Daily Score" />

                            {/* Stagnant Top Score Line (Dashed) */}
                            <Line yAxisId="left" type="stepAfter" dataKey="topScore" stroke="#fff" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Top Score" />

                            {/* Accuracy Line (Orange) */}
                            <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} name="Accuracy %" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SYLLABUS DRILLDOWN (Moved here from StatsColumn) */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                        <Crosshair size={16} className="text-zinc-500" /> Subject Mastery
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">LIVE TRACKER</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 max-h-[240px]">
                    {Object.entries(SYLLABUS_DRILLDOWN).map(([subj, topics]) => (
                        <div key={subj} className="border-b border-zinc-800/50 pb-2 last:border-0">
                            <button
                                onClick={() => setExpandedSubject(expandedSubject === subj ? null : subj)}
                                className="w-full flex justify-between items-center group cursor-pointer py-1"
                            >
                                <span className={`text-[10px] font-black uppercase transition-colors ${expandedSubject === subj ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                    {subj}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-zinc-600">
                                        {Math.round(topics.reduce((acc, t) => acc + t.progress, 0) / topics.length)}%
                                    </span>
                                    <ChevronDown size={12} className={`text-zinc-600 transition-transform ${expandedSubject === subj ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            {expandedSubject === subj && (
                                <div className="mt-2 space-y-3 pl-2 border-l-2 border-zinc-800 ml-1.5 animate-in slide-in-from-top-2 duration-200">
                                    {topics.map(t => (
                                        <div key={t.name}>
                                            <div className="flex justify-between text-[9px] text-zinc-500 mb-1">
                                                <span className="font-medium text-zinc-400">{t.name}</span>
                                                <span className="font-mono">{t.progress}%</span>
                                            </div>
                                            <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-500 ${t.progress > 80 ? 'bg-emerald-500' : t.progress > 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${t.progress}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 5. ADVANCED FILTER (Logic Added)
const AdvancedFilter = ({ filter, setFilter, sort, setSort, search, setSearch, onTakeTest }) => {
    // New State for Multi-Select Topics
    const [selectedTopics, setSelectedTopics] = useState([]);
    // Date Range State (Defaults: 10 Feb to 29 Nov)
    const [startDate, setStartDate] = useState('2026-02-10');
    const [endDate, setEndDate] = useState('2026-11-29');

    const toggleTopic = (topic) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    // Derived state for filtering
    const filteredTests = REPO_TESTS.filter(test => {
        const matchesSubject = filter === 'ALL' || test.subject === filter;
        const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(test.topic);
        const matchesSearch = test.title.toLowerCase().includes(search.toLowerCase()) ||
            test.topic.toLowerCase().includes(search.toLowerCase());

        // Date Logic
        const testDate = new Date(test.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Normalize time elements to avoid issues
        testDate.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const matchesDate = testDate >= start && testDate <= end;

        return matchesSubject && matchesTopic && matchesSearch && matchesDate;
    }).sort((a, b) => {
        if (!sort) return 0;
        const scoreA = a.score || -1;
        const scoreB = b.score || -1;
        return sort === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    });

    const ALL_TOPICS = ['Arithmetic', 'Geometry', 'Number System', 'Algebra', 'Modern Math', 'Reading Comprehension', 'Verbal Ability', 'Logical Reasoning', 'Data Interpretation'];

    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] mt-12">
            {/* SIDEBAR - Responsive: Stacks on mobile, sidebar on desktop */}
            <div className="w-full md:w-72 bg-zinc-900 p-6 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col gap-8">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Filter Targets</h3>

                {/* Sort */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sort By</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <button
                                onClick={() => setSort('asc')}
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${sort === 'asc' ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-700'}`}>
                                {sort === 'asc' && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
                            </button>
                            <span className={`text-xs font-bold transition-colors ${sort === 'asc' ? 'text-white' : 'text-zinc-400'}`}>Score Ascending</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <button
                                onClick={() => setSort('desc')}
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${sort === 'desc' ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-700'}`}>
                                {sort === 'desc' && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
                            </button>
                            <span className={`text-xs font-bold transition-colors ${sort === 'desc' ? 'text-white' : 'text-zinc-400'}`}>Score Descending</span>
                        </label>
                    </div>
                </div>

                {/* Subject Tabs */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Filter By Subject</label>
                    <div className="flex gap-2">
                        {['LRDI', 'Quant', 'VARC'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(filter === s ? 'ALL' : s)}
                                className={`flex-1 py-2 border text-xs font-bold rounded uppercase transition-all
                                    ${filter === s
                                        ? s === 'Quant' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : s === 'VARC' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500' : 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'}
                                `}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Topics Checkbox - Multi Select */}
                <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Filter By Topic</label>
                        {selectedTopics.length > 0 && (
                            <button onClick={() => setSelectedTopics([])} className="text-[9px] text-zinc-500 hover:text-white uppercase font-bold">Clear</button>
                        )}
                    </div>

                    <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
                        {ALL_TOPICS.map(topic => {
                            const isChecked = selectedTopics.includes(topic);
                            return (
                                <label key={topic} className="flex items-center gap-3 cursor-pointer group select-none">
                                    <div
                                        onClick={(e) => { e.preventDefault(); toggleTopic(topic); }}
                                        className={`w-4 h-4 rounded border-2 transition-colors flex items-center justify-center ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700 bg-zinc-950 group-hover:border-zinc-500'}`}
                                    >
                                        {isChecked && <Check size={10} className="text-black stroke-[4px]" />}
                                    </div>
                                    <span className={`text-xs font-medium transition-colors ${isChecked ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{topic}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MAIN LIST AREA */}
            <div className="flex-1 p-6 flex flex-col gap-6 bg-black/50">
                {/* Search Bar & Date Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Topic, Subject..."
                            className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm px-4 py-3 pl-11 rounded-lg focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-600"
                        />
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    </div>

                    {/* Date Range Picker */}
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-3 md:py-0 w-full md:w-auto">
                        <Calendar size={14} className="text-zinc-500" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent text-xs font-bold text-zinc-300 focus:outline-none w-[90px] cursor-pointer"
                        />
                        <span className="text-zinc-600">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent text-xs font-bold text-zinc-300 focus:outline-none w-[90px] cursor-pointer"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[600px]">
                    {filteredTests.map(test => (
                        <div key={test.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between group gap-4 md:gap-0">
                            <div>
                                <h4 className="flex flex-wrap items-center gap-2 text-sm font-bold text-white mb-1">
                                    <span className={`${test.subject === 'Quant' ? 'text-orange-500' : test.subject === 'VARC' ? 'text-indigo-500' : 'text-emerald-500'}`}>{test.subject}:</span>
                                    <span>{test.title}</span>
                                    <span className="text-zinc-500">({test.topic})</span>
                                </h4>
                                {test.status === 'completed' ? (
                                    <div className="text-xs font-mono text-zinc-500">Your Score: <span className="text-white">{test.score}/{test.max}</span></div>
                                ) : (
                                    <div className="text-xs font-mono text-emerald-500 flex items-center gap-1"><Zap size={10} /> New Intel Available</div>
                                )}
                            </div>

                            <button
                                onClick={() => onTakeTest && onTakeTest(test)}
                                className="w-full md:w-auto px-6 py-2 bg-white text-black text-xs font-black uppercase rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                                {test.status === 'completed' ? 'Retake' : 'Take Test'} <ArrowRight size={14} />
                            </button>
                        </div>
                    ))}
                    {filteredTests.length === 0 && (
                        <div className="text-center py-20 text-zinc-600 text-sm font-bold">NO MISSION INTEL FOUND</div>
                    )}
                </div>
            </div>
        </div>
    );
}

// MAIN COMPONENT
export default function DailyTargets({ onStart }) {
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [showPopup, setShowPopup] = useState(false);

    // Repository State
    const [filter, setFilter] = useState('ALL');
    const [sort, setSort] = useState(null); // 'asc' | 'desc'
    const [search, setSearch] = useState('');

    // Consolidated Handler for Start
    const handleBeginAssessment = (configOverride) => {
        if (!onStart) return;

        let examConfig;

        if (configOverride && configOverride.mode === 'repository-test') {
            // REPOSITORY MODE CONFIG
            examConfig = {
                mode: 'repository-test',
                title: configOverride.title,
                subject: configOverride.subject,
                topic: configOverride.topic,
                duration: 20 * 60, // 20 mins default for drills
                questions: 10, // Default for drills
                ...configOverride
            };
        } else {
            // DAILY MOCK PROTOCOL (Default)
            examConfig = {
                title: "Daily Mock Protocol",
                mode: 'daily-target',
                sections: [
                    { id: 'varc', name: 'VARC', duration: 13 * 60, questions: 5 },
                    { id: 'dilr', name: 'DILR', duration: 13 * 60, questions: 1 },
                    { id: 'qa', name: 'QA', duration: 14 * 60, questions: 5 }
                ]
            };
        }
        onStart(examConfig);
    };

    return (
        <div className="w-full px-6 md:px-12 py-8 space-y-12 pb-40 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
            {/* HEADER */}
            <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            DAILY TARGETS
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium pl-5">
                        Consistently executing micro-targets is the only path to the 99%ile.
                    </p>
                </div>
            </div>

            {/* HERO GRID (Responsive Fix) */}
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_280px] gap-6 items-start">
                <ProfileCompact selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                <DailyMockHero date={selectedDate} onStart={() => setShowPopup(true)} />
                <StatsColumn />
            </div>

            {/* ANALYTICS GRAPHS */}
            <AnalyticsSection />

            {/* REPOSITORY SECTION */}
            <div className="mt-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-2 h-8 bg-white rounded-full"></div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Mission Repository</h2>
                </div>
                <AdvancedFilter
                    filter={filter} setFilter={setFilter}
                    sort={sort} setSort={setSort}
                    search={search} setSearch={setSearch}
                    onTakeTest={(test) => handleBeginAssessment({
                        mode: 'repository-test',
                        id: test.id,
                        title: test.title,
                        subject: test.subject,
                        topic: test.topic
                    })}
                />
            </div>

            {/* POPUP MOCK */}
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden">
                        <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                            <XCircle size={24} />
                        </button>

                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 animate-pulse">
                                <Crosshair size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Daily Protocol Initialized</h3>
                            <p className="text-zinc-400 text-sm mb-8">
                                40 Minutes • 3 Sections (13m + 13m + 14m)
                            </p>

                            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 text-left space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase">VARC (13m)</span>
                                    <span className="text-white font-mono">5 Qs (RC + VA)</span>
                                </div>
                                <div className="w-full h-px bg-zinc-800"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase">DILR (13m)</span>
                                    <span className="text-white font-mono">1 Set (Distribution)</span>
                                </div>
                                <div className="w-full h-px bg-zinc-800"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase">Quant (14m)</span>
                                    <span className="text-white font-mono">5 Qs (Time & Work)</span>
                                </div>
                            </div>

                            <button
                                onClick={handleBeginAssessment}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black text-base font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                BEGIN ASSESSMENT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
