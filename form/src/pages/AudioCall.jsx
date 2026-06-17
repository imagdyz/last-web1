import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Volume2, Video, MicOff, PhoneOff, ShieldCheck, MoreHorizontal } from "lucide-react";
import { DOCTORS } from '../data/doctors';

export default function AudioCall() {
    const navigate = useNavigate();
    const location = useLocation();
    const [seconds, setSeconds] = useState(0);

    const doctor = location.state?.doctor || DOCTORS[0];

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans flex flex-col overflow-hidden text-white" dir="rtl">
            
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] -ml-40 -mb-40 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <header className="relative z-20 flex items-center justify-between px-8 py-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/10 transition-all"
                >
                    <ArrowRight size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={14} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[3px] text-blue-200/60">مكالمة آمنة</span>
                    </div>
                    <p className="text-xs font-bold text-white/40">اتصال صوتي مشفر</p>
                </div>
                <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/10 transition-all">
                    <MoreHorizontal size={24} />
                </button>
            </header>

            <main className="flex-1 relative z-20 flex flex-col items-center justify-center px-8">
                <div className="relative mb-12">
                    {/* Pulsing Rings */}
                    <div className="absolute inset-0 bg-blue-500/20 rounded-[60px] scale-[1.4] animate-ping opacity-20"></div>
                    <div className="absolute inset-0 bg-blue-500/10 rounded-[60px] scale-[1.8] animate-pulse opacity-10" style={{ animationDelay: '0.5s' }}></div>
                    
                    <div className="relative">
                        <img 
                            src={doctor.img} 
                            alt={doctor.name} 
                            className="w-48 h-48 rounded-[56px] object-cover border-4 border-white/10 shadow-2xl relative z-10" 
                        />
                        <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-[#0f172a] shadow-xl z-20">
                            <Volume2 size={24} />
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">{doctor.name}</h2>
                    <div className="flex flex-col items-center gap-2">
                        <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-black rounded-full border border-blue-500/20">
                            {doctor.role}
                        </span>
                        <p className="text-3xl font-mono font-medium text-white/80 mt-4 tabular-nums">
                            {formatTime(seconds)}
                        </p>
                    </div>
                </div>
            </main>

            <footer className="relative z-20 px-10 pb-20 pt-10">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-16">
                        <button className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 shadow-xl backdrop-blur-md">
                            <MicOff size={28} />
                        </button>
                        <button className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 shadow-xl backdrop-blur-md">
                            <Volume2 size={28} />
                        </button>
                        <button className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 shadow-xl backdrop-blur-md">
                            <Video size={28} />
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="w-24 h-24 rounded-[32px] bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 active:scale-95 transition-all shadow-2xl shadow-rose-500/40 animate-in zoom-in duration-700"
                        >
                            <PhoneOff size={36} />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

