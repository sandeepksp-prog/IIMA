import React, { useState, useMemo } from 'react';
import {
    HelpCircle, Target, CheckCircle, XCircle, FastForward,
    Filter, ChevronDown, BarChart2, Zap
} from 'lucide-react';
import { ANALYTICS_MASTER_DATA } from '../data/analyticsMasterData';

export default function MockAnalysisEngine() {
    const [selectedMock, setSelectedMock] = useState("TRUE CAT 1");
    const [selectedSection, setSelectedSection] = useState("Overall");
    const [granularity, setGranularity] = useState("Topics");

    // Get Data based on section & granularity
    const rawData = useMemo(() => {
        const key = granularity === "Topics" ? "topics" : "subTopics";

        // 1. Check if we have LOCAL user attempt data for this mock
        // Simplified mapping: converting mock name to a key-friendly string if needed, 
        // but for now relying on exact string match or simple ID convention.
        // In ExamInterface, we save as `exam_state_${examData.id}`.
        // We need to ensure we look for the same ID. 
        // For True CAT Mocks, we assume the name IS the ID for now.
        const EXAM_KEY = `exam_state_${selectedMock}`;
        const savedAttempt = localStorage.getItem(EXAM_KEY);

        let mockData;

        if (savedAttempt) {
            // Transform Local Storage Data into Analytics Format
            try {
                const parsed = JSON.parse(savedAttempt);
                const { questions, responses } = parsed;

                // Helper to build topic map
                const buildTopicMap = (qs) => {
                    const map = {};
                    qs.forEach((q, idx) => {
                        let topic = "General";
                        let subTopic = "Mixed Practice";

                        // Infer topic/subtopic if missing
                        if (q.section === 'VARC') { topic = 'Reading Comprehension'; subTopic = 'Critical Reasoning'; }
                        if (q.section === 'DILR') { topic = 'Logical Reasoning'; subTopic = 'Games & Tournaments'; }
                        if (q.section === 'QA') { topic = 'Arithmetic'; subTopic = 'Time & Work'; }

                        if (q.topic) topic = q.topic; // Use real metadata if available
                        if (q.subTopic) subTopic = q.subTopic;

                        const response = responses[idx];
                        const isAttempted = response !== undefined;
                        const isCorrect = isAttempted && response === q.correct_option;

                        const target = granularity === "Topics" ? topic : subTopic;

                        if (!map[target]) map[target] = { name: target, total: 0, attempted: 0, correct: 0, wrong: 0, skipped: 3 };

                        map[target].total++;
                        // Fix skipped accounting (simplistic)
                        map[target].skipped = map[target].total - (isAttempted ? 1 : 0); // Resetting skipped logic 
                        // Actually, let's just increment correctly
                        map[target].skipped = map[target].total - map[target].attempted; // Recalculate at end? No.
                        // Let's redo:
                        // Initialize if new
                    });

                    // Second pass for clean counts or better reducer
                    // Simplified:
                    const resultMap = {};
                    qs.forEach((q, idx) => {
                        let topic = "General";
                        let subTopic = "Mixed Practice";
                        if (q.section === 'VARC') { topic = 'Reading Comprehension'; subTopic = 'Critical Reasoning'; }
                        else if (q.section === 'DILR') { topic = 'Logical Reasoning'; subTopic = 'Grid Based'; }
                        else if (q.section === 'QA') { topic = 'Arithmetic'; subTopic = 'Time & Work'; }

                        // Override if question has metadata (Golden Questions do)
                        if (q.topic) topic = q.topic;

                        const target = granularity === "Topics" ? topic : subTopic;
                        if (!resultMap[target]) resultMap[target] = { name: target, total: 0, attempted: 0, correct: 0, wrong: 0, skipped: 0 };

                        const res = responses[idx];
                        const att = res !== undefined;
                        const corr = att && res === q.correct_option;

                        resultMap[target].total++;
                        if (att) resultMap[target].attempted++;
                        else resultMap[target].skipped++;

                        if (corr) resultMap[target].correct++;
                        else if (att) resultMap[target].wrong++;
                    });

                    return Object.values(resultMap);
                };

                const relevantQs = selectedSection === 'Overall'
                    ? questions
                    : questions.filter(q => q.section === selectedSection);

                return buildTopicMap(relevantQs);

            } catch (e) {
                console.error("Failed to parse local attempt data", e);
                mockData = ANALYTICS_MASTER_DATA.mockAnalysis.byMock?.[selectedMock] || {};
            }
        } else {
            // No local attempt -> Use Master Data
            mockData = ANALYTICS_MASTER_DATA.mockAnalysis.byMock?.[selectedMock] || {};
        }

        if (selectedSection === "Overall") {
            const allData = [];
            ["VARC", "DILR", "QA"].forEach(sec => {
                if (mockData[sec] && mockData[sec][key]) {
                    allData.push(...mockData[sec][key]);
                }
            });
            return allData;
        }

        return mockData[selectedSection]?.[key] || [];
    }, [selectedSection, granularity, selectedMock]);

    // Derive Totals for Metrics Row
    const metrics = useMemo(() => {
        return rawData.reduce((acc, curr) => ({
            total: acc.total + curr.total,
            attempted: acc.attempted + curr.attempted,
            correct: acc.correct + curr.correct,
            wrong: acc.wrong + curr.wrong,
            skipped: acc.skipped + curr.skipped
        }), { total: 0, attempted: 0, correct: 0, wrong: 0, skipped: 0 });
    }, [rawData]);

    // Derive Strength Buckets
    const { weak, moderate, strong } = useMemo(() => {
        const buckets = { weak: [], moderate: [], strong: [] };
        rawData.forEach(item => {
            if (item.attempted === 0) return; // Skip unseen/unattempted for buckets? Or treat as 0%? Treating as unclassified for now.
            const acc = (item.correct / item.attempted) * 100;
            if (acc < 30) buckets.weak.push(item);
            else if (acc <= 70) buckets.moderate.push(item);
            else buckets.strong.push(item);
        });
        return buckets;
    }, [rawData]);

    return (
        <div className="p-8 pb-32 min-h-screen bg-zinc-950 text-zinc-50 font-sans animate-in fade-in duration-500">

            {/* HEADER & FILTERS */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-2">
                        Analysis Across All Mocks
                    </h1>
                    <p className="text-zinc-500 font-mono text-sm">
                        Deep dive forensic analysis of your testing DNA.
                    </p>
                </div>

                {/* DROPDOWNS */}
                <div className="flex flex-wrap gap-4">
                    {/* Mock Selector */}
                    <div className="relative group z-50">
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1 ml-1">Exam Series</label>
                        <MockDropdown
                            options={ANALYTICS_MASTER_DATA.mockAnalysis.meta.mocks}
                            selected={selectedMock}
                            onChange={setSelectedMock}
                        />
                    </div>

                    {/* Section Selector */}
                    <div className="relative group">
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1 ml-1">Section</label>
                        <div className="flex bg-zinc-900 border-2 border-zinc-800 rounded-lg p-1">
                            {["Overall", "VARC", "DILR", "QA"].map(sec => (
                                <button
                                    key={sec}
                                    onClick={() => setSelectedSection(sec)}
                                    className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${selectedSection === sec
                                        ? 'bg-zinc-800 text-white shadow-sm'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    {sec}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Granularity */}
                    <div className="relative group">
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1 ml-1">Granularity</label>
                        <div className="flex bg-zinc-900 border-2 border-zinc-800 rounded-lg p-1">
                            {["Topics", "Sub-Topics"].map(g => (
                                <button
                                    key={g}
                                    onClick={() => setGranularity(g)}
                                    className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${granularity === g
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* METRICS ROW (5 Pillars) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                <MetricCard
                    icon={HelpCircle} label="Total Questions" value={metrics.total}
                    color="text-zinc-400" bg="bg-zinc-900" border="border-zinc-800"
                />
                <MetricCard
                    icon={Target} label="Attempted" value={metrics.attempted}
                    sub={`${Math.round((metrics.attempted / metrics.total) * 100)}%`}
                    color="text-indigo-400" bg="bg-zinc-900" border="border-zinc-800"
                />
                <MetricCard
                    icon={CheckCircle} label="Correct" value={metrics.correct}
                    sub={`${Math.round((metrics.correct / metrics.attempted) * 100)}% Acc`}
                    color="text-emerald-400" bg="bg-zinc-900" border="border-zinc-800"
                />
                <MetricCard
                    icon={XCircle} label="Incorrect" value={metrics.wrong}
                    sub={`${Math.round((metrics.wrong / metrics.attempted) * 100)}% Err`}
                    color="text-rose-400" bg="bg-zinc-900" border="border-zinc-800"
                />
                <MetricCard
                    icon={FastForward} label="Skipped" value={metrics.skipped}
                    color="text-zinc-500" bg="bg-zinc-900" border="border-zinc-800"
                />
            </div>

            {/* DATA GRID */}
            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden mb-12 shadow-[8px_8px_0px_0px_#000]">
                <div className="p-6 border-b-2 border-zinc-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <BarChart2 size={18} className="text-indigo-500" />
                        {selectedSection} Performance Matrix
                    </h3>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                        {granularity.toUpperCase()} VIEW
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-950 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b-2 border-zinc-800">
                                <th className="p-4 w-1/3">Topic / Sub-Topic</th>
                                <th className="p-4 text-center">Total</th>
                                <th className="p-4 text-center text-indigo-400">Attempted</th>
                                <th className="p-4 text-center text-emerald-400">Correct</th>
                                <th className="p-4 text-center text-rose-400">Wrong</th>
                                <th className="p-4 text-center text-zinc-400">Skipped</th>
                                <th className="p-4 text-center text-zinc-300">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-mono divide-y divide-zinc-800">
                            {rawData.map((row, i) => {
                                const acc = row.attempted > 0 ? Math.round((row.correct / row.attempted) * 100) : 0;
                                return (
                                    <tr key={i} className="hover:bg-zinc-800/50 transition-colors group">
                                        <td className="p-4 font-sans font-bold text-zinc-300 group-hover:text-white transition-colors">
                                            {row.name}
                                        </td>
                                        <td className="p-4 text-center text-zinc-500">{row.total}</td>
                                        <td className="p-4 text-center font-bold text-indigo-300 bg-zinc-950">{row.attempted}</td>
                                        <td className="p-4 text-center font-bold text-emerald-400 bg-zinc-950">{row.correct}</td>
                                        <td className="p-4 text-center font-bold text-rose-400 bg-zinc-950">{row.wrong}</td>
                                        <td className="p-4 text-center text-zinc-500">{row.skipped}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${acc >= 80 ? 'text-emerald-400 border border-emerald-500/20' :
                                                acc >= 50 ? 'text-amber-400 border border-amber-500/20' :
                                                    'text-rose-400 border border-rose-500/20'
                                                }`}>
                                                {acc}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* STRENGTH BUCKETS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BucketCard title="Weak Areas (< 30%)" items={weak} color="rose" icon={Zap} />
                <BucketCard title="Moderate (30-70%)" items={moderate} color="blue" icon={Filter} />
                <BucketCard title="Strong Areas (> 70%)" items={strong} color="emerald" icon={CheckCircle} />
            </div>

        </div>
    );
}

function MetricCard({ icon: Icon, label, value, sub, color, bg, border = "border-transparent" }) {
    return (
        <div className={`p-4 rounded-lg border-2 ${border} ${bg} flex flex-col items-center justify-center gap-2 hover:border-zinc-500 transition-all shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000]`}>
            <div className={`p-2 rounded bg-zinc-950 border border-zinc-800 ${color}`}>
                <Icon size={20} />
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-black text-white">{value}</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{label}</p>
                {sub && <span className="text-[10px] font-mono text-zinc-500 mt-1 block">{sub}</span>}
            </div>
        </div>
    );
}

function BucketCard({ title, items, color, icon: Icon }) {
    const colorClasses = {
        rose: "border-rose-900 bg-zinc-900 text-rose-500",
        blue: "border-blue-900 bg-zinc-900 text-blue-500",
        emerald: "border-emerald-900 bg-zinc-900 text-emerald-500"
    };

    // Simplify to Zinc borders with slight color hint in header only
    const headerColor = {
        rose: "text-rose-500",
        blue: "text-blue-500",
        emerald: "text-emerald-500"
    }

    return (
        <div className={`rounded-lg border-2 border-zinc-800 bg-zinc-900 p-6 h-full hover:border-zinc-600 transition-all shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0px_0px_#000]`}>
            <div className="flex items-center gap-3 mb-6">
                <Icon size={20} className={headerColor[color]} />
                <h4 className={`font-black uppercase tracking-wider text-sm ${headerColor[color]}`}>{title}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.length > 0 ? items.map((item, i) => (
                    <span key={i} className={`px-3 py-1.5 rounded text-xs font-bold bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-default`}>
                        {item.name}
                    </span>
                )) : (
                    <span className="text-xs text-zinc-600 italic">No topics here.</span>
                )}
            </div>
        </div>
    );
}

function MockDropdown({ options, selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-500 px-4 py-2 rounded-lg text-sm font-bold min-w-[200px] justify-between transition-all text-white"
            >
                {selected}
                <ChevronDown size={14} className="text-zinc-500" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-full max-h-60 overflow-y-auto bg-zinc-900 border-2 border-zinc-800 rounded-lg shadow-xl z-20 custom-scrollbar">
                        {options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-zinc-800 transition-colors ${selected === opt ? 'text-indigo-400 bg-zinc-950' : 'text-zinc-400'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
