import React, { useState } from 'react';
import { ChevronRight, Clock, Target, AlertCircle } from 'lucide-react';

export default function TechTree({ data }) {
    const [metric, setMetric] = useState('accuracy'); // 'accuracy' | 'time'

    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl relative">

            {/* Background Grid - Deep Space Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>

            {/* Header / Toggle */}
            <div className="relative z-10 p-4 border-b border-zinc-800/50 flex justify-between items-center backdrop-blur-sm bg-black/20">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${metric === 'accuracy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {metric === 'accuracy' ? <Target size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                            {metric === 'accuracy' ? 'Accuracy Mastery' : 'Time Efficiency'} Tree
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-mono">ROOT CAUSE ANALYSIS</p>
                    </div>
                </div>

                <div className="flex bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
                    <button
                        onClick={() => setMetric('time')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all
                            ${metric === 'time' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Time
                    </button>
                    <button
                        onClick={() => setMetric('accuracy')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all
                            ${metric === 'accuracy' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Accuracy
                    </button>
                </div>
            </div>

            {/* Tree Content */}
            <div className="p-6 relative z-10 overflow-x-auto min-h-[300px]">
                <TreeNode node={data} level={0} metric={metric} />
            </div>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-4 text-[10px] font-mono text-zinc-500 bg-black/60 px-3 py-1.5 rounded-full border border-zinc-900/80 backdrop-blur">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Optimal
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Average
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span> Critical
                </div>
            </div>
        </div>
    );
}

function TreeNode({ node, level, metric }) {
    const [expanded, setExpanded] = useState(level < 1);
    const hasChildren = node.children && node.children.length > 0;

    // --- Dynamic Scoring Logic ---
    const getStatus = () => {
        if (metric === 'accuracy') {
            if (node.accuracy >= 80) return 'good';
            if (node.accuracy >= 60) return 'avg';
            return 'bad';
        } else {
            // Very naive time parsing for demo: "3m 12s" -> seconds check (mock logic)
            // Just randomizing for visual demo if exact parsing is overkill here
            const timeStr = node.avgTime || "";
            const min = parseInt(timeStr.split('m')[0]) || 0;
            // Mock threshold: > 5 mins is 'slow' for leaf nodes, > 20 for root
            const threshold = level === 0 ? 30 : level === 1 ? 15 : 5;

            if (min < threshold) return 'good';
            if (min < threshold + 2) return 'avg';
            return 'bad';
        }
    };

    const status = getStatus();

    // --- Aesthetic Configuration ---
    const colors = {
        good: metric === 'accuracy'
            ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
            : 'border-blue-500/40 bg-blue-950/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]',
        avg: 'border-yellow-500/40 bg-yellow-950/20 text-yellow-400',
        bad: 'border-red-500/60 bg-red-950/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse-slow'
    };

    const StatusIcon = status === 'good' ? Target : status === 'avg' ? Clock : AlertCircle;

    return (
        <div className="flex flex-col relative">

            <div className="flex items-center group">
                {/* Horizontal Connector */}
                {level > 0 && (
                    <div className={`w-12 h-[2px] transition-all duration-500 
                        ${status === 'good' ? (metric === 'accuracy' ? 'bg-emerald-900' : 'bg-blue-900') : 'bg-zinc-800'}`}
                    />
                )}

                {/* The Node Chip */}
                <div
                    onClick={() => setExpanded(!expanded)}
                    className={`
                        relative z-10 flex items-center justify-between gap-4 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300
                        ${colors[status]}
                        hover:brightness-125 hover:scale-[1.02]
                        min-w-[240px] select-none
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`transition-transform duration-300 ${expanded ? 'rotate-90' : '0'}`}>
                            {hasChildren ? <ChevronRight size={16} /> : <div className="w-4" />}
                        </div>

                        <div>
                            <div className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-0.5">
                                {level === 0 ? 'Section' : level === 1 ? 'Area' : 'Topic'}
                            </div>
                            <div className="text-sm font-bold text-zinc-100 font-sans tracking-tight">
                                {node.name}
                            </div>
                        </div>
                    </div>

                    {/* Metric Value */}
                    <div className="text-right">
                        <div className={`text-lg font-black font-mono leading-none ${status === 'bad' ? 'text-red-500' : 'text-zinc-200'}`}>
                            {metric === 'accuracy' ? `${node.accuracy}%` : node.avgTime}
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-wider opacity-60 mt-1">
                            {metric === 'accuracy' ? 'Accuracy' : 'Avg Time'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Children Container */}
            <div className={`
                flex flex-col ml-[36px] pl-12 border-l-2 transition-all duration-500 ease-in-out origin-top border-zinc-800/10 relative
                ${expanded ? 'opacity-100 max-h-[2000px] py-6' : 'opacity-0 max-h-0 overflow-hidden py-0'}
            `}>
                {/* Vertical Connector Line trace */}
                <div className={`absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-zinc-800 via-zinc-800/50 to-transparent transition-opacity duration-500 ${expanded ? 'opacity-100' : 'opacity-0'}`} />

                {hasChildren && node.children.map((child, idx) => (
                    <div key={child.id || idx} className="relative my-2">
                        <TreeNode node={child} level={level + 1} metric={metric} />
                    </div>
                ))}
            </div>
        </div>
    );
}
