export const ANALYTICS_MASTER_DATA = {
    overview: {
        scoreTrend: [
            { name: 'Mock 1', score: 68, accuracy: 75, percentile: 82 },
            { name: 'Mock 2', score: 72, accuracy: 78, percentile: 85 },
            { name: 'Mock 3', score: 58, accuracy: 65, percentile: 78 },
            { name: 'Mock 4', score: 85, accuracy: 82, percentile: 91 },
            { name: 'Mock 5', score: 92, accuracy: 88, percentile: 95 },
            { name: 'Mock 6', score: 88, accuracy: 85, percentile: 93 },
        ],
        attemptBreakdown: [
            { name: 'Correct', value: 45, color: '#10b981' }, // Green
            { name: 'Wrong', value: 12, color: '#ef4444' },   // Red
            { name: 'Skipped', value: 11, color: '#52525b' }, // Zinc-600
        ],
        kpi: [
            { label: "Avg. Accuracy", value: "78.2%", sub: "+2.4%", color: "text-emerald-400" },
            { label: "Avg Time/Q", value: "1m 42s", sub: "-12s", color: "text-blue-400" },
            { label: "Simulated Score", value: "88 (96%ile)", sub: "Based on last 3", color: "text-purple-400" }
        ]
    },
    sections: {
        VARC: {
            radar: [
                { subject: 'RC - Science', A: 85, fullMark: 100 },
                { subject: 'RC - Humanities', A: 60, fullMark: 100 },
                { subject: 'RC - Business', A: 90, fullMark: 100 },
                { subject: 'Para Summary', A: 70, fullMark: 100 },
                { subject: 'Para Jumbles', A: 40, fullMark: 100 },
                { subject: 'Odd One Out', A: 95, fullMark: 100 },
            ],
            performanceTree: {
                id: 'root',
                name: 'VARC Section',
                avgTime: '42m 00s',
                accuracy: 80,
                size: 165,
                children: [
                    {
                        id: 'rc', name: 'Reading Comprehension', avgTime: '28m 10s', accuracy: 82, size: 105,
                        children: [
                            { id: 'rc-sci', name: 'Genre: Science/Tech', avgTime: '6m 12s', accuracy: 85, size: 40, children: [{ id: 'q-main', name: 'Main Idea', avgTime: '45s', accuracy: 90, size: 20 }, { id: 'q-inf', name: 'Inference', avgTime: '2m 10s', accuracy: 80, size: 20 }] },
                            { id: 'rc-hum', name: 'Genre: Humanities', avgTime: '8m 45s', accuracy: 65, size: 35, children: [{ id: 'q-tone', name: 'Tone/Attitude', avgTime: '30s', accuracy: 70, size: 15 }, { id: 'q-fact', name: 'Fact Based', avgTime: '1m 20s', accuracy: 60, size: 20 }] },
                            { id: 'rc-bus', name: 'Genre: Business', avgTime: '6m', accuracy: 90, size: 30, children: [] }
                        ]
                    },
                    {
                        id: 'va', name: 'Verbal Ability', avgTime: '13m 50s', accuracy: 75, size: 60,
                        children: [
                            { id: 'va-pj', name: 'Para Jumbles (TITA)', avgTime: '3m 15s', accuracy: 40, size: 25 },
                            { id: 'va-sum', name: 'Para Summary', avgTime: '1m 45s', accuracy: 90, size: 20 },
                            { id: 'va-ooo', name: 'Odd One Out', avgTime: '1m 15s', accuracy: 95, size: 15 },
                        ]
                    }
                ]
            }
        },
        DILR: {
            radar: [
                { subject: 'Arrangements', A: 80, fullMark: 100 },
                { subject: 'Games', A: 50, fullMark: 100 },
                { subject: 'Charts (DI)', A: 90, fullMark: 100 },
                { subject: 'Routes', A: 30, fullMark: 100 },
                { subject: 'Venn Diagrams', A: 70, fullMark: 100 },
            ],
            performanceTree: {
                id: 'root',
                name: 'DILR Section',
                avgTime: '38m 30s',
                accuracy: 72,
                size: 155,
                children: [
                    {
                        id: 'lr', name: 'Logical Reasoning', avgTime: '22m 10s', accuracy: 65, size: 75,
                        children: [
                            { id: 'lr-arr', name: 'Arrangements', avgTime: '12m 00s', accuracy: 70, size: 45, children: [{ id: 'q-circ', name: 'Circular', avgTime: '5m', accuracy: 60, size: 45 }] },
                            { id: 'lr-game', name: 'Games/Tournaments', avgTime: '10m 00s', accuracy: 45, size: 30 },
                        ]
                    },
                    {
                        id: 'di', name: 'Data Interpretation', avgTime: '16m 20s', accuracy: 82, size: 80,
                        children: [
                            { id: 'di-calc', name: 'Calculation Based', avgTime: '8m 30s', accuracy: 88, size: 50 },
                            { id: 'di-logic', name: 'Reasoning Based', avgTime: '7m 50s', accuracy: 75, size: 30 },
                        ]
                    }
                ]
            }
        },
        QA: {
            radar: [
                { subject: 'Arithmetic', A: 85, fullMark: 100 },
                { subject: 'Algebra', A: 55, fullMark: 100 },
                { subject: 'Geometry', A: 70, fullMark: 100 },
                { subject: 'Number Sys', A: 90, fullMark: 100 },
                { subject: 'Modern Math', A: 40, fullMark: 100 },
            ],
            performanceTree: {
                id: 'root',
                name: 'QA Section',
                avgTime: '36m 45s',
                accuracy: 68,
                size: 200,
                children: [
                    {
                        id: 'arith', name: 'Arithmetic', avgTime: '14m 20s', accuracy: 82, size: 80,
                        children: [
                            { id: 'tsd', name: 'Time Speed Distance', avgTime: '3m 12s', accuracy: 45, size: 30, children: [{ id: 'rel-speed', name: 'Relative Speed', avgTime: '1m 20s', accuracy: 50, size: 30 }] },
                            { id: 'pnl', name: 'Profit & Loss', avgTime: '1m 45s', accuracy: 95, size: 30 },
                            { id: 'si-ci', name: 'SI / CI', avgTime: '2m 10s', accuracy: 88, size: 20 },
                        ]
                    },
                    {
                        id: 'alg', name: 'Algebra', avgTime: '12m 00s', accuracy: 52, size: 60,
                        children: [
                            { id: 'eq', name: 'Quad Equations', avgTime: '2m 30s', accuracy: 55, size: 35 },
                            { id: 'ineq', name: 'Inequalities', avgTime: '3m 45s', accuracy: 48, size: 25 },
                        ]
                    },
                    {
                        id: 'geo', name: 'Geometry', avgTime: '6m 10s', accuracy: 70, size: 40, children: []
                    },
                    { id: 'mod', name: 'Modern Math', avgTime: '4m 15s', accuracy: 40, size: 20, children: [] }
                ]
            }
        }
    }
};
