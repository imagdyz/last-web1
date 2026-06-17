import React from "react";
import logo from "/logo.jpeg";

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 bg-white z-[10000] flex flex-col items-center justify-center" dir="rtl">
            <div className="flex flex-col items-center">
                {/* Logo Section */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-white rounded-[40px] flex items-center justify-center shadow-2xl shadow-blue-500/10 animate-pulse">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-24 h-24 rounded-3xl object-cover shadow-lg"
                        />
                    </div>
                    {/* Decorative dots */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white animate-bounce"></div>
                </div>

                {/* Text Section */}
                <div className="text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">STOMACH</h1>
                    <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">Medical Hub & AI Assistant</p>
                </div>

                {/* Loading Section */}
                <div className="mt-16 flex flex-col items-center gap-4">
                    <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-progress-loading w-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                        <span className="text-[11px] font-black text-slate-400 mr-2">جاري تهيئة النظام...</span>
                    </div>
                </div>
            </div>

            {/* Bottom Credit */}
            <div className="absolute bottom-10 text-center">
                {/* <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Powered by Advanced AI Technology</p> */}
            </div>
        </div>
    );
}
