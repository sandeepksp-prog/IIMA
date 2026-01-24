import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lightbulb, ChevronRight, Check, X, Target, BookOpen, Brain } from 'lucide-react';
import { Badge, Button } from './NeoUI';

export default function QuestionCard({ question, onAnswer, onNext }) {
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [time, setTime] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [currentSubQ, setCurrentSubQ] = useState(0);

    // Handle RC/DILR sets with multiple questions
    const isSet = question.type === 'RC_SET' || question.type === 'DILR_SET';
    const subQuestions = question.questions || [];
    const currentQ = isSet ? subQuestions[currentSubQ] : question;

    useEffect(() => {
        if (!showResult) {
            const t = setInterval(() => setTime((s) => s + 1), 1000);
            return () => clearInterval(t);
        }
    }, [showResult]);

    useEffect(() => {
        setSelected(null);
        setShowResult(false);
        setTime(0);
        setShowHint(false);
        setCurrentSubQ(0);
    }, [question]);

    const handleSubmit = () => {
        if (!selected) return;
        setShowResult(true);
        onAnswer?.({ selected, correct: selected === currentQ?.correct_option, timeSpent: time });
    };

    const handleNextSubQ = () => {
        if (currentSubQ < subQuestions.length - 1) {
            setCurrentSubQ(currentSubQ + 1);
            setSelected(null);
            setShowResult(false);
            setShowHint(false);
        } else {
            onNext?.();
        }
    };

    const isCorrect = selected === currentQ?.correct_option;
    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    // Get solution data
    const solution = currentQ?.high_iq_solution || {};
    const trapAnalysis = question.trap_analysis || {};

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        {question.section === 'VARC' ? <BookOpen className="w-5 h-5 text-indigo-600" /> :
                            question.section === 'DILR' ? <Brain className="w-5 h-5 text-indigo-600" /> :
                                <Target className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">{question.section}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-sm text-slate-500">{question.topic}</span>
                        </div>
                        {question.pattern_used && (
                            <span className="text-xs text-indigo-600 font-medium">Pattern: {question.pattern_used}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {isSet && (
                        <Badge variant="primary">Q{currentSubQ + 1}/{subQuestions.length}</Badge>
                    )}
                    <Badge variant={question.difficulty === 'Hard' ? 'danger' : 'warning'}>
                        {question.difficulty}
                    </Badge>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-mono font-medium text-slate-600">{formatTime(time)}</span>
                    </div>
                </div>
            </div>

            {/* RC Passage */}
            {question.type === 'RC_SET' && question.passage && (
                <div className="mb-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Reading Passage</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">{question.passage}</p>
                    {question.passage_theme && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                            <span className="text-xs text-slate-500">Theme: {question.passage_theme}</span>
                        </div>
                    )}
                </div>
            )}

            {/* DILR Scenario */}
            {question.type === 'DILR_SET' && question.scenario && (
                <div className="mb-6 p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Scenario</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm">{question.scenario}</p>
                    {question.constraints_summary && (
                        <div className="mt-4 pt-3 border-t border-amber-200">
                            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2 block">Constraints:</span>
                            <ul className="text-xs text-slate-600 space-y-1">
                                {question.constraints_summary.map((c, i) => (
                                    <li key={i}>• {c}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Question */}
            <div className="p-5 bg-slate-50 rounded-xl mb-6">
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                    {currentQ?.question_text || question.question_text}
                </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
                <AnimatePresence>
                    {Object.entries(currentQ?.options || question.options || {}).map(([key, value], i) => {
                        const isSelected = selected === key;
                        const isCorrectOption = key === currentQ?.correct_option;
                        const isWrong = showResult && isSelected && !isCorrectOption;

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                onClick={() => !showResult && setSelected(key)}
                                className={`option-card ${isSelected && !showResult ? 'selected' : ''} ${showResult && isCorrectOption ? 'correct' : ''} ${isWrong ? 'incorrect' : ''}`}
                            >
                                <span className="option-key">{key}</span>
                                <span className={`flex-1 ${showResult && isCorrectOption ? 'text-green-700 font-semibold' : 'text-slate-700'}`}>
                                    {value}
                                </span>
                                {showResult && isCorrectOption && <Check className="w-5 h-5 text-green-600" />}
                                {isWrong && <X className="w-5 h-5 text-red-500" />}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setShowHint(!showHint)}>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Strategic Hint
                    </div>
                </Button>

                {!showResult ? (
                    <Button variant="primary" onClick={handleSubmit} disabled={!selected} className={!selected ? 'opacity-50' : ''}>
                        Submit Answer
                    </Button>
                ) : (
                    <Button variant="primary" onClick={handleNextSubQ}>
                        <div className="flex items-center gap-2">
                            {isSet && currentSubQ < subQuestions.length - 1 ? 'Next Question' : 'Next Set'}
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </Button>
                )}
            </div>

            {/* Strategic Hint */}
            <AnimatePresence>
                {showHint && !showResult && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6">
                        <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Strategic Hint</span>
                            </div>
                            <p className="text-amber-800 text-sm font-medium">
                                {currentQ?.strategic_hint || question.strategic_hint || 'Think about the fundamental concepts involved.'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HIGH-IQ Solution */}
            <AnimatePresence>
                {showResult && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6">
                        <div className={`p-6 rounded-xl border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className={`flex items-center gap-3 mb-4 ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                                {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                <span className="text-xl font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                            </div>

                            {/* HIGH-IQ Solution */}
                            <div className="space-y-4">
                                {solution.mental_model && (
                                    <div className="p-4 bg-white/70 rounded-lg">
                                        <h5 className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-2">🧠 Mental Model (99%ile Approach)</h5>
                                        <p className="text-slate-700 font-medium">{solution.mental_model}</p>
                                    </div>
                                )}

                                {(solution.step_1 || solution.deduction_chain) && (
                                    <div className="p-4 bg-white/70 rounded-lg">
                                        <h5 className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-2">📊 Step-by-Step Solution</h5>
                                        <div className="space-y-2 text-slate-600 text-sm">
                                            {solution.step_1 && <p><strong>Step 1:</strong> {solution.step_1}</p>}
                                            {solution.step_2 && <p><strong>Step 2:</strong> {solution.step_2}</p>}
                                            {solution.step_3 && <p><strong>Step 3:</strong> {solution.step_3}</p>}
                                            {solution.starting_point && <p><strong>Start:</strong> {solution.starting_point}</p>}
                                            {solution.deduction_chain && <p><strong>Deduction:</strong> {solution.deduction_chain}</p>}
                                            {solution.final_arrangement && <p><strong>Result:</strong> {solution.final_arrangement}</p>}
                                            {solution.passage_reference && <p><strong>From passage:</strong> "{solution.passage_reference}"</p>}
                                            {solution.inference_chain && <p><strong>Inference:</strong> {solution.inference_chain}</p>}
                                        </div>
                                    </div>
                                )}

                                {solution.shortcut && (
                                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                                        <h5 className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-2">⚡ Time-Saving Shortcut</h5>
                                        <p className="text-slate-700">{solution.shortcut}</p>
                                    </div>
                                )}

                                {trapAnalysis.common_error && (
                                    <div className="p-4 bg-red-50/50 rounded-lg">
                                        <h5 className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-2">⚠️ Common Mistake</h5>
                                        <p className="text-slate-600 text-sm">{trapAnalysis.common_error}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
