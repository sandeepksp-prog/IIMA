import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronRight, Hash, Zap, Brain, Target, BookOpen, Key, BarChart3, Activity, AlertTriangle, TrendingUp, ArrowLeft } from 'lucide-react';
import PracticeHub from './PracticeHub';

// --- DATA: CAT 2025 SPECIFICATION (Based on 2019 Trends) ---
const PRACTICE_TREE = {
    'VARC': {
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500',
        categories: [
            {
                id: 'rc', title: 'Reading Comprehension', weight: '60-70%', questions: '16/24', priority: 'DOMINANT',
                topics: [
                    { title: 'Inference-Based Passages', types: ['Author Intent', 'Tone', 'Abstract Ideas'], pNum: '01' },
                    { title: 'Trap-Heavy Short Passages', types: ['Fact vs Opinion', 'Trick Options'], pNum: '02' },
                    { title: 'Application-Based RC', types: ['Business', 'Sociology', 'Tech'], pNum: '03' },
                    { title: 'Complex Philosophy', types: ['Dense Text', 'Implicit Meaning'], pNum: '04' }
                ]
            },
            {
                id: 'va', title: 'Verbal Ability', weight: '30-40%', questions: '8/24', priority: 'SECONDARY',
                topics: [
                    { title: 'Para Jumbles (Non-MCQ)', types: ['Logical Flow', 'Coherence', 'TITA'], pNum: '01' },
                    { title: 'Para Summary', types: ['Thematic Inference', 'Gist'], pNum: '02' },
                    { title: 'Odd Sentence Out', types: ['Contextual Fit', 'Disruptors'], pNum: '03' }
                ]
            }
        ]
    },
    'DILR': {
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500',
        categories: [
            {
                id: 'selection', title: 'Set Selection & Strategy', weight: 'CRITICAL', questions: 'N/A', priority: 'CORE',
                topics: [
                    { title: 'Set Recognition Drills', types: ['Easy vs Trap', 'Time Estimation'], pNum: '00' } // Special Priority
                ]
            },
            {
                id: 'graphs', title: 'Graphs & Charts', weight: '~30%', questions: '6-8/20', priority: 'HIGH',
                topics: [
                    { title: 'Mixed Graph Sets', types: ['Data Extraction', 'Multi-Chart Logic'], pNum: '01' },
                    { title: 'Logic-Based DI', types: ['Reasoning Heavy', 'Missing Data'], pNum: '02' }
                ]
            },
            {
                id: 'arrangements', title: 'Arrangements', weight: '~20%', questions: '5/20', priority: 'MODERATE',
                topics: [
                    { title: 'Complex Arrangements', types: ['Circular', 'Matrix Constraint'], pNum: '01' },
                    { title: 'Scheduling & Routes', types: ['Optimization', 'Networks'], pNum: '02' }
                ]
            },
            {
                id: 'quant_reasoning', title: 'Quant Reasoning', weight: '~20%', questions: '4-5/20', priority: 'MODERATE',
                topics: [
                    { title: 'Data Sufficiency', types: ['Statement Based', 'Logic Check'], pNum: '01' },
                    { title: 'Games & Tournaments', types: ['Knockout', 'Betting Scenarios'], pNum: '02' }
                ]
            }
        ]
    },
    'QA': {
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500',
        categories: [
            {
                id: 'arithmetic', title: 'Arithmetic', weight: '40%+', questions: '10/24', priority: 'HIGHEST',
                topics: [
                    { title: 'Trap-Heavy Percentages/P&L', types: ['Complex Language', 'Calculative'], pNum: '01' },
                    { title: 'Time Speed Distance', types: ['Relative Speed', 'Circular Tracks'], pNum: '02' },
                    { title: 'Time & Work', types: ['Efficiency', 'Negative Work'], pNum: '03' },
                    { title: 'Mixtures & Averages', types: ['Weighted Avg', 'Replacement'], pNum: '04' }
                ]
            },
            {
                id: 'algebra', title: 'Algebra', weight: '~30%', questions: '7-8/24', priority: 'HIGH',
                topics: [
                    { title: 'Functions & Graphs', types: ['Maxima/Minima', 'Properties'], pNum: '01' },
                    { title: 'Quadratic & Linear', types: ['Roots', 'Possible Values'], pNum: '02' },
                    { title: 'Inequalities & Modulus', types: ['Range', 'Critical Points'], pNum: '03' }
                ]
            },
            {
                id: 'geometry', title: 'Geometry', weight: '~20%', questions: '4-5/24', priority: 'MODERATE',
                topics: [
                    { title: 'Coordinate & Mensuration', types: ['Shoelace', '3D Cutting'], pNum: '01' },
                    { title: 'Triangles & Circles', types: ['Properties', 'Tangents'], pNum: '02' },
                    { title: 'Trig & Advanced Geo', types: ['Heights', 'Sine Rule', 'Polygons'], pNum: '03' }
                ]
            },
            {
                id: 'numbers', title: 'Number Systems', weight: '~10%', questions: '2-3/24', priority: 'LOW',
                topics: [
                    { title: 'Remainders & Base', types: ['Cyclicity', 'Last Digit'], pNum: '01' },
                    { title: 'Factors & Multiples', types: ['Total Factors', 'Sum of Factors'], pNum: '02' }
                ]
            },
            {
                id: 'modern_rare', title: 'Modern Math & Rare', weight: '<5%', questions: '0-2/24', priority: 'RARE',
                topics: [
                    { title: 'P&C and Probability', types: ['Distribution', 'Bayes'], pNum: '01' },
                    { title: 'Binomial & Crypto', types: ['Expansions', 'Integral Sol'], pNum: '02' },
                    { title: 'Statistics & Misc', types: ['Std Dev', 'Complex nums'], pNum: '03' }
                ]
            }
        ]
    }
};

export default function PracticeTests({ onStart }) {
    const [view, setView] = useState('hub'); // 'hub' or 'list'
    const [activeTab, setActiveTab] = useState('QA');
    const [expandedCategory, setExpandedCategory] = useState('arithmetic');

    const handleHubNavigation = (target, params) => {
        if (target === 'practice_list') {
            setActiveTab(params.domain.toUpperCase());
            setView('list');
        }
    };

    if (view === 'hub') {
        return <PracticeHub onNavigate={handleHubNavigation} />;
    }

    const tree = PRACTICE_TREE[activeTab];

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-zinc-800 pb-6">
                <div>
                    <button
                        onClick={() => setView('hub')}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Hub
                    </button>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Target className="w-8 h-8 text-amber-500" />
                        PRACTICE <span className="text-zinc-500">LAB</span>
                    </h2>
                    <p className="text-zinc-400 mt-2 font-mono">
                        CAT 2025 Spec. <span className="text-emerald-500">Intelligence Layer Active</span>.
                    </p>
                </div>

                {/* TABS */}
                <div className="flex bg-zinc-900 border-2 border-zinc-800 p-1 rounded-lg mt-4 md:mt-0">
                    {Object.keys(PRACTICE_TREE).map(subject => (
                        <button
                            key={subject}
                            onClick={() => { setActiveTab(subject); setExpandedCategory(null); }}
                            className={`px-6 py-2 font-bold font-mono transition-all uppercase tracking-wider
                                ${activeTab === subject
                                    ? `bg-zinc-800 text-white shadow-sm border-b-2 ${PRACTICE_TREE[subject].border}`
                                    : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN STACK FLOW */}
            <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-right-4 duration-500">
                {tree.categories.map((cat, idx) => {
                    const isExpanded = expandedCategory === cat.id;

                    return (
                        <div
                            key={cat.id}
                            className={`group border-2 transition-all duration-300 relative overflow-hidden
                            ${isExpanded
                                    ? `border-zinc-700 bg-zinc-900`
                                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'}`}
                        >
                            {/* CATEGORY HEADER CARD */}
                            <button
                                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                                className="w-full flex items-center justify-between p-6 cursor-pointer relative z-10"
                            >
                                <div className="flex items-center gap-6">
                                    {/* Number / Icon */}
                                    <div className={`w-12 h-12 flex items-center justify-center font-black text-xl border-2 rounded-sm
                                        ${isExpanded ? `${tree.border} ${tree.bg} ${tree.color}` : 'border-zinc-800 bg-zinc-900 text-zinc-600'}`}>
                                        {idx + 1}
                                    </div>

                                    {/* Info */}
                                    <div className="text-left">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className={`text-xl font-bold uppercase tracking-wide ${isExpanded ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                                {cat.title}
                                            </h3>
                                            {/* PRIORITY BADGE */}
                                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase text-black bg-zinc-400 rounded-sm
                                                ${cat.priority === 'HIGHEST' || cat.priority === 'DOMINANT' ? 'bg-amber-500' :
                                                    cat.priority === 'HIGH' ? 'bg-emerald-400' :
                                                        cat.priority === 'CORE' ? 'bg-white' : 'bg-zinc-600 text-zinc-300'}`}>
                                                {cat.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-mono mt-1 text-zinc-500">
                                            <span className="flex items-center gap-1"><Activity size={10} /> Weight: {cat.weight}</span>
                                            <span className="flex items-center gap-1"><BarChart3 size={10} /> Qs: {cat.questions}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Icon */}
                                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : 'text-zinc-600'}`}>
                                    <ChevronDown size={24} />
                                </div>
                            </button>

                            {/* PROGRESS BAR (Visual Weightage) */}
                            <div className="absolute bottom-0 left-0 h-1 bg-zinc-800 w-full z-0">
                                <div className={`h-full opacity-50 ${tree.bg.replace('/10', '')}`} style={{ width: (cat.weight === 'CRITICAL' ? '100' : cat.weight.replace('~', '').replace('%', '').replace('+', '').split('-')[0]) + '%' }}></div>
                            </div>

                            {/* EXPANDED TOPICS LIST */}
                            {isExpanded && (
                                <div className="p-6 pt-0 border-t-2 border-zinc-800/50 bg-black/20">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                        {cat.topics.map((topic, tIdx) => (
                                            <div key={tIdx} className="p-4 border-2 border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-600 transition-all group/card flex flex-col justify-between h-full relative overflow-hidden">
                                                {/* PRIORITY NUMBER (Top Right) */}
                                                <div className="absolute top-0 right-0 p-1 bg-zinc-800 border-l border-b border-zinc-700 text-[10px] font-black text-zinc-500 z-10">
                                                    P-{topic.pNum}
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-zinc-300 text-sm mb-3 flex items-center gap-2 pr-6">
                                                        <Key size={14} className="text-zinc-500" /> {topic.title}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {topic.types.map(type => (
                                                            <span key={type} className="text-[10px] px-2 py-1 bg-black border border-zinc-800 text-zinc-500 rounded hover:text-zinc-300 cursor-default">
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => onStart({ title: `Practice: ${topic.title}`, subject: activeTab, questions: 10, duration: 20 })}
                                                    className={`w-full py-3 text-xs font-black uppercase tracking-wider border-2 border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-none
                                                    ${tree.color.replace('text-', 'hover:border-')}`}
                                                >
                                                    <Zap size={14} /> SOLVE SET
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
