import React, { useEffect, useState } from 'react';
import { Hourglass, CheckCircle2 } from 'lucide-react';

const SandboxLoader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing Sandbox Environment...');

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Non-linear progress for realism
                const increment = Math.random() * 15;
                return Math.min(prev + increment, 100);
            });
        }, 300);

        // Status updates
        setTimeout(() => setStatus('Encrypting Response Data...'), 1000);
        setTimeout(() => setStatus('Syncing with Central Repository...'), 2000);
        setTimeout(() => setStatus('Finalizing Submission...'), 2800);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                onComplete();
            }, 500); // Short delay after 100%
        }
    }, [progress, onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            {/* Animated Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>

            <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full px-6">

                {/* Icon Container */}
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                    <div className="relative bg-zinc-900 border-2 border-zinc-800 p-6 rounded-2xl shadow-2xl">
                        {progress < 100 ? (
                            <Hourglass className="w-12 h-12 text-emerald-500 animate-spin-slow" />
                        ) : (
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                        )}
                    </div>
                </div>

                {/* Status Text */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white tracking-widest uppercase">
                        {progress < 100 ? 'Processing' : 'Complete'}
                    </h2>
                    <p className="text-zinc-500 font-mono text-sm h-6">
                        {status}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Matrix-like decorative text */}
                <div className="absolute bottom-10 font-mono text-[10px] text-zinc-800 flex gap-8 opacity-50">
                    <span>SECURE_CONNECTION: ESTABLISHED</span>
                    <span>ENCRYPTION: AES-256</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(180deg); } 
                }
                .animate-spin-slow {
                    animation: spin-slow 3s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default SandboxLoader;
