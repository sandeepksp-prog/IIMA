import React from 'react';

// --- PALETTES ---
const COLORS = {
    accuracy: {
        mastery: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-400' },
        good: { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-400' },
        average: { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-400' },
        critical: { bg: 'bg-red-700', text: 'text-white', border: 'border-red-500' },
        neutral: { bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600' }
    },
    time: {
        fast: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-400' },
        okay: { bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-400' },
        slow: { bg: 'bg-rose-700', text: 'text-white', border: 'border-rose-500' },
        neutral: { bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600' }
    }
};

const getColor = (value, metric) => {
    if (metric === 'accuracy') {
        const num = parseFloat(value);
        if (num >= 85) return COLORS.accuracy.mastery;
        if (num >= 70) return COLORS.accuracy.good;
        if (num >= 50) return COLORS.accuracy.average;
        return COLORS.accuracy.critical;
    } else {
        // Time logic: Assume string input
        const str = String(value);
        if (str.includes('10m') || str.includes('12m') || str.includes('15m') || str.includes('20m')) return COLORS.time.slow;
        if (str.includes('30s') || str.includes('45s') || str.includes('1m')) return COLORS.time.fast;
        return COLORS.time.okay;
    }
};

// --- RECURSIVE NODE COMPONENT ---
const HeatmapNode = ({ node, depth, metric }) => {
    // Styling based on Depth
    const isLeaf = !node.children || node.children.length === 0;

    // Size logic: use flex-grow based on node.size roughly
    // We can't perfectly map area without complex logic, but flex-grow works for "relative volume"
    const flexGrow = node.size || 10;

    // Color
    const val = metric === 'accuracy' ? (node.accuracy || 0) : (node.avgTime || "0m");
    const colorTheme = getColor(val, metric);

    if (isLeaf) {
        return (
            <div
                className={`flex-grow min-w-[60px] min-h-[60px] p-2 m-0.5 rounded-md shadow-sm 
                            flex flex-col items-center justify-center text-center overflow-hidden
                            transition-all hover:scale-[1.03] hover:z-10 cursor-help
                            ${colorTheme.bg} ${colorTheme.border} border-t`}
                style={{ flexBasis: `${Math.max(60, flexGrow)}px` }}
                title={`${node.name}: ${val}${metric === 'accuracy' ? '%' : ''}`}
            >
                <div className="text-[10px] font-bold uppercase leading-tight drop-shadow-md pb-1">
                    {node.name}
                </div>
                <div className="text-[9px] font-mono bg-black/20 px-1.5 rounded text-white/90">
                    {metric === 'accuracy' ? `${val}%` : val}
                </div>
            </div>
        );
    }

    // Parent Node (Container)
    return (
        <div
            className={`flex-grow flex flex-col m-1 p-2 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm`}
            style={{ flexBasis: `${Math.max(150, flexGrow * 4)}px` }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-1.5 px-1 border-b border-slate-700/30 pb-1">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest truncate max-w-[80%]">
                    {node.name}
                </span>
                {depth === 1 && (
                    <span className={`w-1.5 h-1.5 rounded-full ${metric === 'accuracy' ? 'bg-teal-500' : 'bg-blue-500'}`}></span>
                )}
            </div>

            {/* Children Container (Flex Wrap) */}
            <div className="flex flex-wrap items-stretch content-start w-full gap-0.5">
                {node.children.map((child, i) => (
                    <HeatmapNode
                        key={i}
                        node={child}
                        depth={depth + 1}
                        metric={metric}
                    />
                ))}
            </div>
        </div>
    );
};

export default function NestedTreemap({ data, metric = 'accuracy' }) { // Renamed internally but exporting as NestedTreemap to keep imports working
    if (!data) return <div className="p-8 text-slate-500">No Data</div>;

    const rootChildren = Array.isArray(data) ? data : (data.children || []);

    return (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col font-sans h-[500px]">
            {/* Header */}
            <div className="bg-slate-950 p-3 border-b border-slate-800 flex justify-between items-center px-6 flex-none">
                <h4 className="text-slate-200 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${metric === 'accuracy' ? 'bg-teal-500' : 'bg-blue-500'} animate-pulse`} />
                    {metric === 'accuracy' ? 'Performance Heatmap' : 'Time Distribution'}
                </h4>

                {/* Simple Legend */}
                <div className="flex gap-4">
                    {['Mastery', 'Good', 'Avg', 'Critical'].map((label, i) => {
                        const colors = [COLORS.accuracy.mastery.bg, COLORS.accuracy.good.bg, COLORS.accuracy.average.bg, COLORS.accuracy.critical.bg];
                        return (
                            <div key={label} className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-sm ${colors[i]}`}></div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase">{label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                <div className="flex flex-wrap w-full align-top content-start p-1">
                    {rootChildren.map((child, i) => (
                        <HeatmapNode
                            key={i}
                            node={child}
                            depth={1}
                            metric={metric}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
