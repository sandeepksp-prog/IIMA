import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar, Trophy, Flame, Target, Clock, Filter,
    ArrowRight, CheckCircle2, XCircle, Brain,
    ChevronDown, BarChart2, Zap, Crown, Ghost, Crosshair,
    Play, Search, ChevronRight, User, MousePointer2, ChevronUp
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from 'recharts';

// --- REF DATA & LOGIC ---
const CAT_DATE = new Date('2026-11-29T00:00:00'); // Approx CAT Date

// Mock Analytics Data (Restored richness)
const WEEKLY_GRIND_DATA = [
    { name: 'Mon', val: 30, top: 45 },
    { name: 'Tue', val: 50, top: 55 },
    { name: 'Wed', val: 40, top: 60 },
    { name: 'Thu', val: 70, top: 75 }, // Peak
    { name: 'Fri', val: 55, top: 80 },
    { name: 'Sat', val: 85, top: 90 },
    { name: 'Sun', val: 0, top: 95 },
];

const ACCURACY_DATA = [
    { day: '1', score: 30, acc: 80, top_acc: 90 },
    { day: '2', score: 45, acc: 85, top_acc: 92 },
    { day: '3', score: 40, acc: 82, top_acc: 93 },
    { day: '4', score: 60, acc: 88, top_acc: 94 },
    { day: '5', score: 75, acc: 90, top_acc: 95 },
    { day: '6', score: 70, acc: 89, top_acc: 96 },
    { day: '7', score: 85, acc: 95, top_acc: 97 },
];

const SYLLABUS_DRILLDOWN = {
    'Quant': [
        { name: 'Arithmetic', progress: 85 },
        { name: 'Algebra', progress: 40 },
        { name: 'Geometry', progress: 20 },
        { name: 'Number System', progress: 10 },
        { name: 'Modern Maths', progress: 5 }
    ],
    'VARC': [
        { name: 'RC Inference', progress: 60 },
        { name: 'Para Jumbles', progress: 30 },
        { name: 'Summary', progress: 50 }
    ],
    'LRDI': [
        { name: 'Arrangements', progress: 70 },
        { name: 'Games', progress: 40 },
        { name: 'Charts', progress: 25 }
    ]
};

const REPO_TESTS = [
    { id: 101, subject: 'Quant', topic: 'Literacy Percentage Problem', score: 3, max: 5, status: 'completed' },
    { id: 102, subject: 'LRDI', topic: 'Laptop Sales Distribution', score: null, max: 15, status: 'new' },
    { id: 103, subject: 'VARC', topic: 'Turing Test', score: null, max: 12, status: 'new' },
    { id: 104, subject: 'Quant', topic: 'Decreasing Digits Count', score: null, max: 5, status: 'new' },
    { id: 105, subject: 'VARC', topic: 'Power of Awe', score: null, max: 12, status: 'new' },
    { id: 106, subject: 'LRDI', topic: 'Variable Payoffs', score: null, max: 15, status: 'new' },
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

// 1. REFINED PROFILE (Filled Space & Logical XP)
const ProfileCompact = ({ selectedDate, onSelectDate }) => {
    // Generate dates dynamically around "Today"
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 3 + i);
        return {
            date: d.getDate(),
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            fullDate: d,
            isToday: i === 3,
            status: i < 3 ? 'completed' : i === 3 ? 'pending' : 'future',
            score: i < 3 ? Math.floor(Math.random() * 20) + 10 : 0
        };
    });

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl h-full flex flex-col justify-between shadow-lg min-h-[400px]">
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-emerald-500/50 relative overflow-hidden">
                        <User size={28} className="text-zinc-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Sandeep</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
                                Season XP: 842
                            </span>
                        </div>
                    </div>
                </div>

                {/* FILLED SPACE: Next Rank Progress */}
                <div className="bg-zinc-950/50 rounded-lg p-3 mb-6 border border-zinc-800/50">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase">Rank Progress</span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase">158 XP to 'Elite'</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[75%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-lg border border-zinc-800 mb-6">
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">4</div>
                        <div className="text-[9px] text-zinc-500 uppercase font-bold">Streak</div>
                    </div>
                    <div className="text-center border-l w-px h-8 border-zinc-800"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-zinc-500">12</div>
                        <div className="text-[9px] text-zinc-600 uppercase font-bold">Best</div>
                    </div>
                </div>
            </div>

            {/* Smart Calendar */}
            <div className="grid grid-cols-7 gap-2">
                {dates.map((item, idx) => {
                    const isSelected = selectedDate === item.date;
                    // Logic: Green only if COMPLETED (score > 0)
                    const isGreen = item.status === 'completed';

                    return (
                        <button
                            key={idx}
                            onClick={() => onSelectDate(item.date)}
                            className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all
                                ${isSelected ? 'bg-emerald-600 shadow-lg scale-110 z-10' : 'hover:bg-zinc-800'}
                            `}
                        >
                            <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-white' : 'text-zinc-600'}`}>{item.day}</span>
                            <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full border-2 transition-all
                                 ${isGreen && !isSelected ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.2)]' :
                                    isSelected ? 'border-white text-black bg-white' :
                                        'border-zinc-800 text-zinc-600 bg-zinc-900'}
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

// 2. DAILY MOCK PROTOCOL (No Changes, just props pass-through)
const DailyMockHero = ({ date, onStart }) => (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-0 rounded-2xl h-full flex flex-col shadow-2xl relative overflow-hidden group min-h-[400px]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-emerald-500 to-indigo-500 opacity-50"></div>

        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                        Daily Mock Protocol
                    </span>
                    <span className="text-xs font-bold text-zinc-500">Jan {date}</span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{DAILY_MOCK_CONTENT.title}</h2>
            </div>
            <div className="text-right">
                <div className="text-3xl font-black text-white tabular-nums">{DAILY_MOCK_CONTENT.total_q}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Questions</div>
            </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
            {DAILY_MOCK_CONTENT.sections.map((sec, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shadow-sm
                        ${sec.subject === 'Quant' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                            sec.subject === 'LRDI' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'}`}>
                        {sec.icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-white">{sec.detail}</span>
                            <span className="text-xs font-mono text-zinc-400 bg-black px-2 py-0.5 rounded">{sec.count}</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-950 mt-2 rounded-full overflow-hidden">
                            <div className={`h-full w-full rounded-full opacity-50 ${sec.color === 'orange' ? 'bg-orange-500' : sec.color === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer Action - Ensure Visibility */}
        <div className="p-6 pt-0 mt-auto">
            <button
                onClick={onStart}
                className="w-full py-4 bg-white hover:bg-emerald-400 hover:scale-[1.02] text-black text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group-hover:shadow-emerald-500/20">
                <Play size={16} fill="currentColor" /> Start Daily Run ({DAILY_MOCK_CONTENT.est_time})
            </button>
        </div>
    </div>
);

// 3. STATS COLUMN (Date Logic + Syllabus Drilldown)
const StatsColumn = () => {
    // Logic: Time Left
    const [daysLeft, setDaysLeft] = useState(0);
    const [expandedSubject, setExpandedSubject] = useState('Quant'); // Drill down state

    useEffect(() => {
        const today = new Date();
        const diff = CAT_DATE - today;
        setDaysLeft(Math.floor(diff / (1000 * 60 * 60 * 24)));
    }, []);

    return (
        <div className="flex flex-col gap-6 h-full min-h-[400px]">
            {/* Countdown */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex-col items-center justify-center relative overflow-hidden flex-shrink-0 min-h-[160px] flex">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Time Pressure</div>
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" stroke="#27272a" strokeWidth="6" fill="none" />
                        <circle cx="56" cy="56" r="48" stroke="#e4e4e7" strokeWidth="6" fill="none" strokeDasharray="4 4" strokeDashoffset="100" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white tracking-tighter">{daysLeft}</span>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase">Days</span>
                    </div>
                </div>
            </div>

            {/* Syllabus with Drill-down - allow flex growth, but min-h */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex-1 flex flex-col min-h-[220px]">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-zinc-400">Syllabus Completion</span>
                    <span className="text-xs font-mono text-emerald-500">100% Target</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
                    {Object.entries(SYLLABUS_DRILLDOWN).map(([subj, topics]) => (
                        <div key={subj} className="border-b border-zinc-800/50 pb-2 last:border-0">
                            <button
                                onClick={() => setExpandedSubject(expandedSubject === subj ? null : subj)}
                                className="w-full flex justify-between items-center group cursor-pointer"
                            >
                                <span className={`text-[10px] font-bold uppercase transition-colors ${expandedSubject === subj ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                    {subj}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-zinc-400">
                                        {Math.round(topics.reduce((acc, t) => acc + t.progress, 0) / topics.length)}%
                                    </span>
                                    {expandedSubject === subj ? <ChevronUp size={10} className="text-zinc-500" /> : <ChevronDown size={10} className="text-zinc-600" />}
                                </div>
                            </button>

                            {/* Expanded Topics */}
                            {expandedSubject === subj && (
                                <div className="mt-2 space-y-2 pl-2 border-l border-zinc-800 ml-1 animate-in slide-in-from-top-2 duration-200">
                                    {topics.map(t => (
                                        <div key={t.name}>
                                            <div className="flex justify-between text-[9px] text-zinc-500 mb-0.5">
                                                <span>{t.name}</span>
                                                <span>{t.progress}%</span>
                                            </div>
                                            <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-500 ${t.progress > 70 ? 'bg-emerald-500' : t.progress > 30 ? 'bg-orange-500' : 'bg-zinc-600'}`} style={{ width: `${t.progress}%` }}></div>
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
}

// 4. RESTORED GRAPHS (AreaCharts)
const AnalyticsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-sm font-bold text-zinc-300 mb-6 flex items-center gap-2">
                <BarChart2 size={16} className="text-emerald-500" /> Weekly Grind
            </h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={WEEKLY_GRIND_DATA}>
                        <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} />
                        <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                        <Area type="monotone" dataKey="top" stroke="#52525b" strokeWidth={1} strokeDasharray="4 4" fill="none" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-sm font-bold text-zinc-300 mb-6 flex items-center gap-2">
                <Crosshair size={16} className="text-orange-500" /> Score vs Accuracy
            </h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ACCURACY_DATA}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="day" hide />
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} />
                        <Area type="monotone" dataKey="score" stroke="#f97316" strokeWidth={2} fill="url(#colorScore)" />
                        <Line type="monotone" dataKey="acc" stroke="#10b981" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="top_acc" stroke="#52525b" strokeDasharray="3 3" strokeWidth={1} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

// MAIN COMPONENT
const AdvancedFilter = ({ filter, setFilter }) => (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] mt-12">
        {/* SIDEBAR FILTER */}
        <div className="w-full md:w-72 bg-zinc-900 p-6 border-r border-zinc-800 flex flex-col gap-8">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Filter Targets</h3>

            {/* Sort */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sort By</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Score Ascending</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-700 group-hover:border-zinc-500 transition-colors"></div>
                        <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">Score Descending</span>
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
                            onClick={() => setFilter(s)}
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

            {/* Topics Checkbox */}
            <div className="space-y-3 flex-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Filter By Topic</label>
                <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
                    {['Arithmetic', 'Geometry', 'Number System', 'Algebra', 'Modern Maths'].map(topic => (
                        <label key={topic} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-4 h-4 rounded border-2 border-zinc-700 bg-zinc-950 group-hover:border-zinc-500 transition-colors flex items-center justify-center"></div>
                            <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">{topic}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>

        {/* MAIN LIST AREA */}
        <div className="flex-1 p-6 flex flex-col gap-6 bg-black/50">
            {/* Search Bar */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search Topic, Subject..."
                        className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm px-4 py-3 pl-11 rounded-lg focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-600"
                    />
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                </div>
                <div className="w-64 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center px-4 text-xs font-bold text-zinc-400">
                    26 Jan 2026 - 01 Feb 2026
                </div>
            </div>

            {/* List */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {REPO_TESTS.filter(t => filter === 'ALL' || t.subject === filter).map(test => (
                    <div key={test.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-all flex items-center justify-between group">
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                                <span className={`${test.subject === 'Quant' ? 'text-orange-500' : test.subject === 'VARC' ? 'text-indigo-500' : 'text-emerald-500'}`}>{test.subject}:</span>
                                <span>({test.topic})</span>
                            </h4>
                            {test.status === 'completed' ? (
                                <div className="text-xs font-mono text-zinc-500">Your Score: <span className="text-white">{test.score}</span></div>
                            ) : (
                                <div className="text-xs font-mono text-emerald-500">New Intel Available</div>
                            )}
                        </div>

                        <button className="px-6 py-2 bg-white text-black text-xs font-black uppercase rounded hover:bg-zinc-200 transition-colors flex items-center gap-2">
                            {test.status === 'completed' ? 'Retake' : 'Take Test'} <ArrowRight size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default function DailyTargets() {
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [showPopup, setShowPopup] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [timeLeft, setTimeLeft] = useState('04:12:33');

    // Live Ticker Mock
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => prev.endsWith(' ') ? '04:12:33' : '04:12:33 ');
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs font-mono text-zinc-400">Targets Expire in: {timeLeft}</span>
                </div>
            </div>

            {/* HERO GRID - FLEXIBLE HEIGHT */}
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
                    <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded text-xs font-bold border border-zinc-700">Archive Access</span>
                </div>
                <AdvancedFilter filter={filter} setFilter={setFilter} />
            </div>

            {/* POPUP MOCK (Unchanged) */}
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
                                15 Questions • 40 Minutes • 3 Sections
                            </p>

                            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 text-left space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase">Quant</span>
                                    <span className="text-white font-mono">5 Qs (Time & Work)</span>
                                </div>
                                <div className="w-full h-px bg-zinc-800"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase">LRDI</span>
                                    <span className="text-white font-mono">1 Set (Distribution)</span>
                                </div>
                                <div className="w-full h-px bg-zinc-800"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase">VARC</span>
                                    <span className="text-white font-mono">5 Qs (RC + VA)</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black text-base font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                BEGIN ASSESSMENT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
