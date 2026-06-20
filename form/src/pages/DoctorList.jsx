import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, ArrowRight, Star, MapPin, ChevronLeft, Sparkles } from "lucide-react";
import { DOCTORS } from "../data/doctors";
import DoctorTopNav from "../components/DoctorTopNav";

export default function DoctorList() {
    const navigate = useNavigate();
    const location = useLocation();

    const condition = location.state?.condition;

    const displayDoctors = useMemo(() => {
        if (!condition) return DOCTORS;

        let prioritySpec = "";
        const cName = condition.name || "";
        if (cName.includes("معدة") || cName.includes("قولون")) prioritySpec = "Gastroenterology";
        else if (cName.includes("قلب")) prioritySpec = "Cardiology";
        else if (cName.includes("نفسي") || cName.includes("اكتئاب")) prioritySpec = "Psychiatry";
        else if (cName.includes("أعصاب")) prioritySpec = "Neurology";
        else if (cName.includes("أطفال")) prioritySpec = "Pediatrics";
        else if (cName.includes("عظام")) prioritySpec = "Orthopedics";

        if (prioritySpec) {
            const matched = DOCTORS.filter(d => d.spec === prioritySpec);
            const others = DOCTORS.filter(d => d.spec !== prioritySpec);
            return [...matched, ...others];
        }
        return DOCTORS;
    }, [condition]);

    const title = condition ? "الأطباء المقترحون لحالتك" : "جميع الأطباء المتاحين";

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans pb-10" dir="rtl">
            <DoctorTopNav />
            
            <header className="p-6 bg-white/80 backdrop-blur-xl sticky top-[73px] z-20 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors">
                        <ArrowRight size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-900">{title}</h1>
                        {condition && <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">بناءً على تشخيص: {condition.name}</p>}
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-black text-slate-900">نتائج البحث</h2>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayDoctors.map((doc, idx) => {
                        const isMatched = condition && idx < DOCTORS.filter(d => d.spec === doc.spec).length;
                        return (
                            <div 
                                key={doc.id} 
                                className={`bg-white rounded-[32px] p-6 shadow-sm border transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 group relative overflow-hidden ${isMatched ? 'border-blue-100' : 'border-slate-50'}`}
                            >
                                {isMatched && (
                                    <div className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-1.5 rounded-br-2xl text-[10px] font-black flex items-center gap-1.5 z-10 shadow-lg">
                                        <Sparkles size={12} /> أفضل تطابق
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-row items-center gap-3 sm:gap-4 flex-1">
                                        <div className="relative shrink-0">
                                            <img src={doc.img} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                                            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{doc.name}</h3>
                                            <p className="text-xs text-slate-400 font-medium mb-1">{doc.role}</p>
                                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-black uppercase tracking-wider">
                                                <MapPin size={10} /> متاح للحجز
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-400 transition-all flex items-center justify-center">
                                        <Heart size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => navigate(`/doctor/profile/${doc.id}`, { state: { doctor: doc } })} 
                                        className="flex-1 py-4 bg-blue-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        حجز موعد الآن
                                        <ChevronLeft size={16} />
                                    </button>
                                    <div className="px-4 py-4 bg-slate-50 rounded-2xl flex flex-col items-center justify-center min-w-[70px]">
                                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none">التقييم</span>
                                        <span className="text-sm font-black text-slate-900 mt-1">{doc.rating}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
