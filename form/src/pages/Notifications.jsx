import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bell, Calendar, Activity, CheckCheck, Trash2, MoreVertical, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
    const navigate = useNavigate();
    const { getNotifications, markAllRead } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        setNotifications(getNotifications());
        markAllRead();
    }, []);

    const iconForType = (type) => {
        if (type === "booking") return <Calendar size={20} className="text-blue-500" />;
        if (type === "diagnosis") return <Activity size={20} className="text-emerald-500" />;
        return <Bell size={20} className="text-slate-400" />;
    };

    const bgForType = (type) => {
        if (type === "booking") return "bg-blue-50/50 border-blue-50";
        if (type === "diagnosis") return "bg-emerald-50/50 border-emerald-50";
        return "bg-slate-50/50 border-slate-50";
    };

    const timeAgo = (isoDate) => {
        const diff = Math.floor((Date.now() - new Date(isoDate)) / 1000);
        if (diff < 60) return "الآن";
        if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
        if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
        return `منذ ${Math.floor(diff / 86400)} يوم`;
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans pb-10" dir="rtl">
            {/* Header Section */}
            <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-6 flex flex-col gap-6 border-b border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm hover:bg-slate-50 transition-all"
                        >
                            <ArrowRight size={20} />
                        </button>
                        <h1 className="text-2xl font-black text-slate-900">الإشعارات</h1>
                    </div>
                    {notifications.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                            <CheckCheck size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">مقروءة</span>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200 mb-8 relative">
                            <div className="absolute inset-0 bg-slate-100 rounded-[40px] scale-110 animate-pulse opacity-50"></div>
                            <Bell size={48} className="relative z-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">لا توجد إشعارات حالياً</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed font-medium">
                            سنقوم بإخطارك هنا عند وجود تحديثات على حجوزاتك أو نتائج تشخيصك الطبي.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((n) => (
                            <div 
                                key={n.id} 
                                className={`flex items-start gap-4 p-5 rounded-[32px] border transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/20 group animate-in slide-in-from-bottom-4 ${bgForType(n.type)}`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
                                    {n.doctorImg ? (
                                        <div className="relative">
                                            <img src={n.doctorImg.startsWith('/') ? n.doctorImg : `/doctors/doc${(parseInt(n.doctorImg) % 9) + 1}.png`} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-lg flex items-center justify-center border-2 border-white">
                                                <ShieldCheck size={10} />
                                            </div>
                                        </div>
                                    ) : iconForType(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-slate-900 text-sm mb-1 leading-tight">{n.title}</p>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{n.message}</p>
                                    <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        <span>•</span>
                                        {timeAgo(n.time)}
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        
                        <button className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-[3px] hover:text-blue-600 transition-colors mt-8">
                            عرض الإشعارات السابقة
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

