import React, { useState, useEffect } from 'react';
import { Home, BookOpen, BarChart2, AlertCircle, Layout, Settings, LogOut, Terminal, Brain, User, Target } from 'lucide-react';
import Dashboard from './components/Dashboard';
import MockList from './components/MockList';
// import ExamInterface from './components/ExamInterface';
// import DailyAnalysis from './components/DailyAnalysis';
// import SectionalMocks from './components/SectionalMocks';
// import PracticeTests from './components/PracticeTests';
// import CatAiChatbot from './components/CatAiChatbot';
// import AnalyticsDashboard from './components/AnalyticsDashboard';
// import MockAnalysisEngine from './components/MockAnalysisEngine';
// import ErrorLog from './components/ErrorLog';
import { fetchHealth } from './api/client';
import useActivityDetection from './hooks/useActivityDetection';

export default function AppDebug() {
    const [currentView, setCurrentView] = useState('dashboard');
    const isUserActive = useActivityDetection(30000);
    const brainStatus = isUserActive ? "Brain Online" : "Offline";

    const renderContent = () => {
        return <Dashboard onNavigate={setCurrentView} />;
    };

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-50 font-sans overflow-hidden">
            <aside className="w-64 bg-zinc-900 border-r-2 border-zinc-800 flex flex-col z-20 hidden md:flex">
                <div className="p-6 border-b-2 border-zinc-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-sm flex items-center justify-center">
                        <span className="font-black text-black">DC</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black">DEBUG <span className="text-emerald-500">MODE</span></h1>
                        <div className="text-xs text-zinc-500">{brainStatus}</div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <div className="p-2 bg-zinc-800/50 text-zinc-400 text-sm">Navigation Disabled</div>
                </nav>
            </aside>
            <main className="flex-1 overflow-auto bg-zinc-950 relative md:pt-0 pt-16">
                {renderContent()}
            </main>
        </div>
    );
}
