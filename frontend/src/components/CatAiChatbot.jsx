import React, { useState, useEffect, useRef } from 'react';
import { Globe, X, Send, Bot, Sparkles, Cpu, Zap, Command } from 'lucide-react';

export default function CatAiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: "Systems Online. I am CAT AI. Ready to crack the exam?" }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setMessages(prev => [...prev, { type: 'user', text: inputText }]);
        setInputText("");
        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'bot', text: "I'm processing that. My logic core is currently referencing the Master Syllabus." }]);
        }, 800);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans">

            {/* CHAT WINDOW (Glassmorphic + Tech) */}
            {isOpen && (
                <div className="mb-6 w-[22rem] bg-zinc-950/90 backdrop-blur-md border border-emerald-500/50 shadow-[0px_0px_40px_-10px_rgba(16,185,129,0.3)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 rounded-2xl ring-1 ring-white/10">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-900/50 to-zinc-900/50 p-4 flex justify-between items-center border-b border-white/10 relative overflow-hidden">
                        {/* Scanning Line Effect */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-[shimmer_2s_infinite]"></div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
                                <Cpu className="text-emerald-400 w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm tracking-widest uppercase flex items-center gap-2">
                                    CAT<span className="text-emerald-500"> AI</span>
                                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-[10px] text-emerald-400 rounded-full border border-emerald-500/30">ONLINE</span>
                                </h3>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-black/40 custom-scrollbar relative">
                        {/* Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`relative z-10 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 text-sm leading-relaxed backdrop-blur-sm border
                                    ${msg.type === 'user'
                                        ? 'bg-zinc-800/80 text-white border-zinc-700/50 rounded-2xl rounded-tr-sm'
                                        : 'bg-emerald-950/30 text-emerald-100 border-emerald-500/20 rounded-2xl rounded-tl-sm shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)]'}`}>
                                    {msg.type === 'bot' && <span className="block text-[10px] font-mono text-emerald-500/70 mb-1 tracking-wider">:: SYSTEM ::</span>}
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-zinc-900/50 border-t border-white/10 flex gap-2 backdrop-blur-sm">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Input Command..."
                                className="w-full bg-zinc-950/50 border border-zinc-700/50 p-2.5 pl-3 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-600 font-mono"
                            />
                            <div className="absolute right-2 top-2.5">
                                <Command size={14} className="text-zinc-700" />
                            </div>
                        </div>
                        <button
                            onClick={handleSend}
                            className="bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-400 p-2.5 rounded-lg border border-emerald-500/30 transition-all flex items-center justify-center group"
                        >
                            <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {/* TRIGGER: THE "COMET" ORBIT GLOBE */}
            <div className="relative group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>

                {/* 1. Orbit Ring */}
                <div className="absolute -inset-2 rounded-full border border-emerald-500/20 animate-[spin_8s_linear_infinite]"></div>

                {/* 2. The Comet (Orbiting Dot) */}
                <div className="absolute -inset-2 rounded-full animate-[spin_3s_linear_infinite]">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_2px_#34d399] absolute top-1/2 -right-1 transform -translate-y-1/2"></div>
                </div>

                {/* 3. The Core Button */}
                <div className={`w-14 h-14 bg-zinc-900 rounded-full border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all duration-300 z-10 overflow-hidden relative
                    ${isOpen ? 'scale-90 bg-emerald-950' : 'hover:scale-110 hover:border-emerald-500/60'}`}>

                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-900 to-emerald-900/50 opacity-80"></div>

                    {/* Wireframe Globe */}
                    <Globe
                        className={`w-7 h-7 text-emerald-400 relative z-20 transition-all duration-500
                        ${isOpen ? 'rotate-[360deg] scale-75 text-white' : 'group-hover:text-emerald-300'}`}
                        strokeWidth={1.5}
                    />

                    {/* Core Pulse */}
                    {!isOpen && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse z-0"></div>}
                </div>

                {/* Label (Tooltip) */}
                {!isOpen && (
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-zinc-900 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none tracking-widest shadow-xl">
                        CAT AI
                    </div>
                )}
            </div>
        </div >
    );
}
