import React, { useState, useEffect } from 'react';
import { Clock, Calculator, HelpCircle, ChevronLeft, ChevronRight, Bookmark, X, Save } from 'lucide-react';
// import goldenQuestionsData from '../data/golden_questions/golden_v2_20260110_183621.json'; // Legacy
import { db, collection, getDocs } from '../services/firebase';

// --- Palette Status Constants ---
const STATUS = {
    NOT_VISITED: 'not-visited',
    NOT_ANSWERED: 'not-answered',
    ANSWERED: 'answered',
    MARKED: 'marked',
    MARKED_ANSWERED: 'marked-answered'
};

// --- TCS iON Palette Colors ---
const PALETTE_COLORS = {
    [STATUS.NOT_VISITED]: 'bg-white text-black border-2 border-zinc-300', // TCS Style: White
    [STATUS.NOT_ANSWERED]: 'bg-red-600 text-white border-2 border-red-700', // TCS Style: Red
    [STATUS.MARKED]: 'bg-purple-600 text-white border-2 border-purple-700', // TCS Style: Purple
    [STATUS.ANSWERED]: 'bg-green-600 text-white border-2 border-green-700', // TCS Style: Green
    [STATUS.MARKED_ANSWERED]: 'bg-purple-600 text-white border-2 border-green-400 relative overflow-hidden' // TCS: Purple with indicator
};

const FALLBACK_QUESTIONS = Array.from({ length: 15 }, (_, i) => ({
    id: `q${i + 1}`,
    section: i < 5 ? 'VARC' : i < 10 ? 'DILR' : 'QA',
    question_text: `This is a sample question ${i + 1} to demonstrate the interface. In a real scenario, this would come from Firestore.`,
    options: { A: "Option 1", B: "Option 2", C: "Option 3", D: "Option 4" },
    correct_option: "A"
}));

// Fetch Questions or Generate from Exam Data
export default function ExamInterface({ examData, onExit }) {
    // --- State ---
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [markedForReview, setMarkedForReview] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [qStatus, setQStatus] = useState([]);

    const EXAM_KEY = `exam_state_${examData?.id || 'default'}`;

    // 1. FULLSCREEN ENFORCEMENT (Kiosk Mode)
    useEffect(() => {
        const enterFullscreen = async () => {
            try {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                }
            } catch (err) {
                console.warn("Fullscreen request denied:", err);
            }
        };
        enterFullscreen();
    }, []);

    // 2. DATA PERSISTENCE & GENERATION
    useEffect(() => {
        const initializeExam = () => {
            // A. Try loading saved state
            const savedState = localStorage.getItem(EXAM_KEY);
            if (savedState) {
                const parsed = JSON.parse(savedState);
                console.log("Resuming exam from saved state:", parsed);

                // If there is saved data, use it
                setQuestions(parsed.questions);
                setResponses(parsed.responses);
                setQStatus(parsed.qStatus);
                setCurrentQIndex(parsed.currentQIndex);
                setTimeLeft(parsed.timeLeft);
                setLoading(false);
                return;
            }

            // B. If no saved state, generate fresh
            if (!examData) {
                setQuestions(FALLBACK_QUESTIONS);
                setQStatus(Array(FALLBACK_QUESTIONS.length).fill(STATUS.NOT_VISITED));
                setTimeLeft(40 * 60);
                setLoading(false);
                return;
            }

            console.log("Generating Fresh Questions for:", examData.title);
            let generatedQs = [];

            if (examData.mode === 'repository-test') {
                // REPOSITORY TEST (Topic Specific)
                console.log("Repo Test Mode:", examData.topic);
                const count = examData.questions || 10;
                generatedQs = Array.from({ length: count }, (_, i) => ({
                    id: `repo-${examData.subject}-${i}`,
                    section: examData.subject || 'General',
                    topic: examData.topic || 'General', // Store topic for logic
                    question_text: `[${examData.subject} - ${examData.topic}] Question ${i + 1}: This is a specialized drill question for ${examData.topic}.`,
                    options: { A: "Option 1", B: "Option 2", C: "Option 3", D: "Option 4" },
                    correct_option: "A"
                }));
                const duration = examData.duration || 20 * 60;
                setTimeLeft(duration);

            } else if (examData.mode === 'daily-target') {
                // DAILY TARGET MODE: 15 Questions (5 VARC, 5 DILR, 5 QA)
                // This matches the config passed from DailyTargets.jsx
                const varcQs = Array.from({ length: 5 }, (_, i) => ({ id: `dt-varc-${i}`, section: 'VARC', type: 'RC', question_text: `[VARC] Daily Target Q${i + 1}: Reading Comprehension Passag...` }));
                const dilrQs = Array.from({ length: 5 }, (_, i) => ({ id: `dt-dilr-${i}`, section: 'DILR', type: 'SET', question_text: `[DILR] Daily Target Q${i + 1}: Data Set Analysis...` }));
                const qaQs = Array.from({ length: 5 }, (_, i) => ({ id: `dt-qa-${i}`, section: 'QA', type: 'MCQ', question_text: `[QA] Daily Target Q${i + 1}: Quantitative Problem...` }));
                generatedQs = [...varcQs, ...dilrQs, ...qaQs];

                // Calculate total duration from sections if available, else 40 mins
                const totalDuration = examData.sections ? examData.sections.reduce((acc, sec) => acc + sec.duration, 0) : 40 * 60;
                setTimeLeft(totalDuration); // Global Timer for Daily Target (allows switching)

            } else if (examData.type === 'Sectional' || examData.subject) {
                const subject = examData.subject || 'VARC';
                const count = examData.questions || 22;
                generatedQs = Array.from({ length: count }, (_, i) => ({
                    id: `sec-${i}`,
                    section: subject,
                    question_text: `[${subject}] Question ${i + 1} of ${count}. This is a generated question for ${examData.title}.`,
                    options: { A: "Option 1", B: "Option 2", C: "Option 3", D: "Option 4" },
                    correct_option: "A"
                }));
                setTimeLeft((examData.duration || 60) * 60);
            } else {
                const varcQs = Array.from({ length: 24 }, (_, i) => ({ id: `varc-${i}`, section: 'VARC', type: 'RC', question_text: `[VARC] Q${i + 1} Placeholder` }));
                const dilrQs = Array.from({ length: 22 }, (_, i) => ({ id: `dilr-${i}`, section: 'DILR', type: 'SET', question_text: `[DILR] Q${i + 1} Placeholder` }));
                const qaQs = Array.from({ length: 22 }, (_, i) => ({ id: `qa-${i}`, section: 'QA', type: 'MCQ', question_text: `[QA] Q${i + 1} Placeholder` }));
                generatedQs = [...varcQs, ...dilrQs, ...qaQs];
                setTimeLeft((examData.duration || 60) * 60);
            }

            setQuestions(generatedQs);
            setQStatus(Array(generatedQs.length).fill(STATUS.NOT_VISITED));
            setLoading(false);
        };

        initializeExam();
    }, [examData]);

    // 3. AUTO-SAVE EVERY 5 SECONDS
    useEffect(() => {
        if (loading || questions.length === 0) return;
        const autoSave = setInterval(() => {
            const stateToSave = {
                questions, // Saving questions in case they were dynamically generated so they don't change on reload
                responses,
                qStatus,
                currentQIndex,
                timeLeft
            };
            localStorage.setItem(EXAM_KEY, JSON.stringify(stateToSave));
        }, 5000);
        return () => clearInterval(autoSave);
    }, [questions, responses, qStatus, currentQIndex, timeLeft, loading]);

    // Timer Logic
    useEffect(() => {
        if (loading) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading]);

    // Cleanup on exit
    const handleExit = (discard = false) => {
        // Exit Fullscreen
        if (document.exitFullscreen) document.exitFullscreen().catch(() => { });

        if (discard) {
            localStorage.removeItem(EXAM_KEY); // Clear saved data on discard
        } // Else keep it (users might want to submit later or it was accidental)

        onExit();
    };

    // Helpers
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0') + ":" + s.toString().padStart(2, '0');
    };

    const handleOptionSelect = (optionKey) => {
        setResponses(prev => ({ ...prev, [currentQIndex]: optionKey }));
    };

    const saveAndNext = () => {
        setQStatus(prev => {
            const next = [...prev];
            next[currentQIndex] = responses[currentQIndex] ? STATUS.ANSWERED : STATUS.NOT_ANSWERED;
            return next;
        });
        if (currentQIndex < questions.length - 1) setCurrentQIndex(prev => prev + 1);
    };

    const markForReview = () => {
        setQStatus(prev => {
            const next = [...prev];
            next[currentQIndex] = responses[currentQIndex] ? STATUS.MARKED_ANSWERED : STATUS.MARKED;
            return next;
        });
        if (currentQIndex < questions.length - 1) setCurrentQIndex(prev => prev + 1);
    };

    const clearResponse = () => {
        const nextResponses = { ...responses };
        delete nextResponses[currentQIndex];
        setResponses(nextResponses);
    };

    const realQ = questions[currentQIndex] || {}; // Handle async load safely

    // Handling set type questions for display
    const isSet = realQ.type === 'RC_SET' || realQ.type === 'DILR_SET';
    const subQIndex = 0; // Simplified for now, just showing the set wrapper

    return (
        <div className="flex flex-col h-screen bg-zinc-950 text-zinc-50 font-sans overflow-hidden">

            {/* 1. HEADER (Sticky Top) */}
            <header className="h-16 bg-zinc-900 border-b-2 border-zinc-800 flex items-center justify-between px-6 shadow-md z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-zinc-800 p-2 rounded border border-zinc-700">
                        <h1 className="text-xl font-bold font-mono tracking-tighter">CAT 2026 MOCK 12</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="bg-black/50 px-4 py-2 rounded-lg border border-zinc-800 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-emerald-500 animate-pulse" />
                        <span className="text-2xl font-mono font-bold text-emerald-400">{formatTime(timeLeft)}</span>
                    </div>

                    <button
                        onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                        className="p-2 bg-zinc-800 border-2 border-zinc-700 hover:bg-zinc-700 active:scale-95 transition-all text-zinc-300"
                        title="Calculator"
                    >
                        <Calculator className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => handleExit(false)}
                        className="px-6 py-2 bg-emerald-900/20 border-2 border-emerald-900 text-emerald-500 hover:bg-emerald-900/40 font-bold text-sm flex items-center gap-2"
                    >
                        <Save size={16} /> Submit
                    </button>

                    <button
                        onClick={() => handleExit(true)}
                        className="px-4 py-2 bg-red-900/20 border-2 border-red-900 text-red-500 hover:bg-red-900/40 font-bold text-sm flex items-center gap-2"
                    >
                        <X size={16} /> Discard
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT (Split View) */}
            <div className="flex flex-1 overflow-hidden">

                {/* 2. LEFT COLUMN: Question Area (75%) */}
                <div className="w-3/4 flex flex-col border-r-2 border-zinc-800 bg-zinc-950">

                    {/* Question Header */}
                    <div className="p-4 border-b-2 border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                        <span className="text-lg font-bold text-zinc-400">Question {currentQIndex + 1}</span>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-zinc-800 text-xs font-mono text-zinc-500 border border-zinc-700 uppercase">
                                {realQ.section || 'VARC'}
                            </span>
                            <span className="px-2 py-1 bg-zinc-800 text-xs font-mono text-zinc-500 border border-zinc-700">
                                +3 / -1
                            </span>
                        </div>
                    </div>

                    {/* Scrollable Question Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-8">

                            {/* Context / Scenerio / Passage */}
                            {(realQ.passage || realQ.scenario) && (
                                <div className="p-6 bg-zinc-900 border-l-4 border-indigo-500 rounded-r-lg mb-8">
                                    <h4 className="text-indigo-400 text-xs font-bold uppercase mb-2 tracking-wider flex items-center gap-2">
                                        <Bookmark className="w-4 h-4" />
                                        {realQ.passage ? 'READING PASSAGE' : 'DATA SET SCENARIO'}
                                    </h4>
                                    <p className="font-serif text-lg leading-loose text-zinc-300">
                                        {realQ.passage || realQ.scenario}
                                    </p>
                                    {realQ.constraints_summary && (
                                        <ul className="mt-4 space-y-2 font-mono text-sm text-amber-500/80">
                                            {realQ.constraints_summary.map((c, i) => <li key={i}>• {c}</li>)}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* The Question Stem */}
                            <div className="text-xl font-serif text-zinc-100 leading-relaxed font-medium">
                                {isSet && realQ.questions ? realQ.questions[subQIndex].question_text : realQ.question_text}
                            </div>

                            {/* Options */}
                            <div className="space-y-4 pt-4">
                                {Object.entries((isSet && realQ.questions ? realQ.questions[subQIndex].options : realQ.options) || {}).map(([key, value]) => {
                                    const isSelected = responses[currentQIndex] === key;
                                    return (
                                        <label
                                            key={key}
                                            className={`flex items-start p-4 border-2 cursor-pointer transition-all group ${isSelected
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                                                }`}
                                            onClick={() => handleOptionSelect(key)}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center font-bold text-xs ${isSelected
                                                ? 'border-emerald-500 bg-emerald-500 text-black'
                                                : 'border-zinc-600 text-zinc-600 group-hover:border-zinc-400'
                                                }`}>
                                                {key}
                                            </div>
                                            <span className="text-lg text-zinc-300 group-hover:text-white font-medium">{value}</span>
                                        </label>
                                    );
                                })}
                            </div>

                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="h-20 bg-zinc-900 border-t-2 border-zinc-800 flex items-center justify-between px-8">
                        <div className="flex gap-4">
                            <button
                                onClick={markForReview}
                                className="px-6 py-3 border-2 border-purple-500/50 text-purple-400 hover:bg-purple-900/20 font-bold uppercase text-sm tracking-wide transition-colors"
                            >
                                Mark for Review
                            </button>
                            <button
                                onClick={clearResponse}
                                className="px-6 py-3 border-2 border-zinc-700 text-zinc-400 hover:bg-zinc-800 font-bold uppercase text-sm tracking-wide transition-colors"
                            >
                                Clear Response
                            </button>
                        </div>

                        <button
                            onClick={saveAndNext}
                            className="px-8 py-3 bg-emerald-600 border-2 border-emerald-500 text-white font-bold uppercase text-lg tracking-wide shadow-[4px_4px_0px_0px_#052e16] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#052e16] transition-all flex items-center gap-2"
                        >
                            Save & Next <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                </div>

                {/* 3. RIGHT COLUMN: Question Palette (25%) */}
                <div className="w-1/4 bg-zinc-900 h-full flex flex-col">

                    {/* Candidate Profile Summary */}
                    <div className="p-6 border-b-2 border-zinc-800 flex items-center gap-4 bg-zinc-950">
                        <div className="w-12 h-12 rounded bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                            <span className="text-xl font-bold text-zinc-500">JS</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">John Smith</h3>
                            <p className="text-xs text-zinc-500 font-mono">ID: CAT2026-X99</p>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="p-4 grid grid-cols-2 gap-2 text-xs font-mono text-zinc-500 border-b-2 border-zinc-800">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500"></div> Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500"></div> Not Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-zinc-200"></div> Not Visited
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500"></div> Review
                        </div>
                    </div>

                    {/* Palette Grid - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <h4 className="text-zinc-600 font-bold uppercase text-xs mb-4 tracking-wider">Question Palette</h4>
                        <div className="grid grid-cols-4 gap-3">
                            {qStatus.map((status, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQIndex(idx)}
                                    className={`aspect-square flex items-center justify-center font-bold text-sm border-2 border-transparent transition-all ${idx === currentQIndex ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-900 z-10 scale-110' : ''
                                        } ${PALETTE_COLORS[status]} hover:opacity-80`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Palette Footer - Section Switcher */}
                    <div className="p-4 border-t-2 border-zinc-800 bg-zinc-950">
                        <h4 className="text-xs text-zinc-500 font-bold mb-2 uppercase">Sections</h4>
                        <div className="flex gap-2">
                            {['VARC', 'DILR', 'QA'].map(sec => {
                                // Calculate start index for this section
                                const startIndex = questions.findIndex(q => q.section === sec);
                                const isActive = questions[currentQIndex]?.section === sec;
                                return (
                                    <button
                                        key={sec}
                                        onClick={() => {
                                            if (startIndex !== -1) setCurrentQIndex(startIndex);
                                        }}
                                        className={`flex-1 py-2 text-xs font-bold border-b-2 hover:bg-zinc-800 transition-colors
                                            ${isActive ? 'bg-zinc-800 text-emerald-400 border-emerald-500' : 'bg-zinc-900 text-zinc-500 border-transparent'}
                                        `}
                                    >
                                        {sec}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                </div>

            </div>

            {/* Floating Calculator Mockup */}
            {isCalculatorOpen && (
                <div className="absolute top-20 right-1/4 bg-zinc-800 border-2 border-zinc-600 p-4 w-64 shadow-xl rounded z-50">
                    <div className="flex justify-between mb-4">
                        <span className="font-mono text-xs">Calculator</span>
                        <X className="w-4 h-4 cursor-pointer" onClick={() => setIsCalculatorOpen(false)} />
                    </div>
                    <div className="bg-zinc-900 h-10 mb-4 border border-zinc-700"></div>
                    <div className="grid grid-cols-4 gap-2">
                        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(k => (
                            <button key={k} className="p-2 bg-zinc-700 hover:bg-zinc-600 text-white font-mono text-sm">{k}</button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
