import React, { useState } from 'react';
import { Clock, Target, Info } from 'lucide-react';

// --- PALETTES ---
const PALETTES = {
    accuracy: {
        mastery: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-400' },
        good: { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-400' },
        average: { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-400' },
        critical: { bg: 'bg-red-700', text: 'text-white', border: 'border-red-500' },
    },
    time: { // Cool = Fast/Efficient, Warm = Slow/Inefficient
        efficient: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-400' }, // Fast
        optimal: { bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-400' }, // Ideal
        slow: { bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-400' },   // Slow
        critical: { bg: 'bg-red-800', text: 'text-white', border: 'border-red-500' }     // Very Slow
    }
};

// Helper: Time Parser (string "2m 30s" -> seconds)
const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    let total = 0;
    const mMatch = timeStr.match(/(\d+)m/);
    const sMatch = timeStr.match(/(\d+)s/);
    if (mMatch) total += parseInt(mMatch[1]) * 60;
    if (sMatch) total += parseInt(sMatch[1]);
    return total;
};

// Helper: Color Logic
const getColor = (node, mode) => {
    if (mode === 'accuracy') {
        const val = node.accuracy || 0;
        if (val >= 85) return PALETTES.accuracy.mastery;
        if (val >= 70) return PALETTES.accuracy.good;
        if (val >= 50) return PALETTES.accuracy.average;
        return PALETTES.accuracy.critical;
    } else {
        // Time Logic: Compare avgTime vs "Ideal" (Mocked logic if missing)
        // Assumption: Ideal time is roughly 1.5 - 2 mins for VARC/QA, 4-5 mins for DILR sets.
        // We will use a heuristic: if Avg Time > 2.5m (150s) for non-set questions => Slow.
        // For sets (DILR), we accept higher.
        // Better Heuristic: Use the "Display String".
        const tStr = node.avgTime || "0m";
        if (tStr.includes('10m') || tStr.includes('12m') || tStr.includes('15m')) return PALETTES.time.critical; // DILR Set Sink
        if (tStr.includes('5m') || tStr.includes('6m')) return PALETTES.time.slow;
        if (tStr.includes('2m') || tStr.includes('3m')) return PALETTES.time.optimal;
        return PALETTES.time.efficient; // < 2m
    }
};

const HeatmapNode = ({ node, depth, mode }) => {
    const isLeaf = !node.children || node.children.length === 0;
    const flexGrow = node.size || 10;
    const colorTheme = getColor(node, mode);

    // Display Value
    const displayVal = mode === 'accuracy' ? `${node.accuracy || 0}%` : (node.avgTime || "-");
    const label = mode === 'accuracy' ? 'Acc' : 'Time';

    if (isLeaf) {
        return (
            <div
                className={`flex-grow min-w-[70px] min-h-[60px] p-2 m-0.5 rounded-md shadow-sm relative group
                            flex flex-col items-center justify-center text-center overflow-hidden cursor-help
                            transition-all hover:scale-[1.05] hover:z-20 border-t ${colorTheme.border} ${colorTheme.bg}`}
                style={{ flexBasis: `${Math.max(60, flexGrow)}px` }}
            >
                {/* TOOLTOP (Hover) */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 text-white text-xs p-2 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none">
                    <div className="font-bold uppercase mb-1">{node.name}</div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10px]">
                        <span className="text-slate-400">Accuracy:</span> <span className={node.accuracy >= 80 ? 'text-emerald-400' : 'text-amber-400'}>{node.accuracy}%</span>
                        <span className="text-slate-400">Avg Time:</span> <span className="text-blue-400">{node.avgTime}</span>
                        <span className="text-slate-400">Volume:</span> <span className="text-slate-200">{node.size || 'N/A'}</span>
                    </div>
                </div>

                <div className="text-[9px] font-black uppercase leading-tight drop-shadow-md pb-1 text-white/90 truncate w-full px-1">
                    {node.name}
                </div>
                <div className="text-[10px] font-mono bg-black/30 px-1.5 rounded text-white font-bold backdrop-blur-sm">
                    {displayVal}
                </div>
            </div>
        );
    }

    // Parent Node (Section/Area)
    return (
        <div
            className={`flex-grow flex flex-col m-1 p-2 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm`}
            style={{ flexBasis: `${Math.max(150, flexGrow * 3.5)}px` }}
        >
            <div className="flex justify-between items-center mb-1.5 px-1 border-b border-slate-700/30 pb-1">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest truncate max-w-[85%]">
                    {node.name}
                </span>
                {depth === 1 && (
                    <div className={`w-1.5 h-1.5 rounded-full ${mode === 'accuracy' ? 'bg-emerald-500' : 'bg-blue-500'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`}></div>
                )}
            </div>

            <div className="flex flex-wrap items-stretch content-start w-full gap-0.5">
                {node.children.map((child, i) => (
                    <HeatmapNode key={i} node={child} depth={depth + 1} mode={mode} />
                ))}
            </div>
        </div>
    );
};

export default function SmartHeatmap({ data, title = "Performance Heatmap" }) {
    const [mode, setMode] = useState('accuracy'); // 'accuracy' | 'time'

    if (!data) return <div className="p-8 text-slate-500 text-sm italic">No Data Available</div>;

    // Handle both single root object or array of roots
    const rootChildren = Array.isArray(data) ? data : (data.children || []);

    return (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans h-[420px] mb-6">
            {/* Header Control Bar */}
            <div className="bg-slate-900/80 p-3 border-b border-slate-800 flex justify-between items-center px-6 flex-none backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${mode === 'accuracy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {mode === 'accuracy' ? <Target size={14} /> : <Clock size={14} />}
                    </div>
                    <h4 className="text-slate-200 text-xs font-black uppercase tracking-widest">
                        {title}
                    </h4>
                </div>

                {/* Start Toggle Group */}
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setMode('accuracy')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all
                            ${mode === 'accuracy'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Accuracy
                    </button>
                    <button
                        onClick={() => setMode('time')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all
                            ${mode === 'time'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Time
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2 no-scrollbar bg-slate-950/50">
                <div className="flex flex-wrap w-full align-top content-start p-1">
                    {rootChildren.map((child, i) => (
                        <HeatmapNode
                            key={i}
                            node={child}
                            depth={1}
                            mode={mode}
                        />
                    ))}
                </div>
            </div>

            {/* Footer Legend */}
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-900 flex justify-end gap-4 text-[9px] font-bold uppercase text-slate-500">
                {mode === 'accuracy' ? (
                    <>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-600"></span> Mastery (>85%)</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-600"></span> Good (>70%)</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-700"></span> Critical ({'<50%'})</span>
                    </>
                ) : (
                    <>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-600"></span> Efficient</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-600"></span> Optimal</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-600"></span> Slow</span>
                    </>
                )}
            </div>
        </div>
    );
}
