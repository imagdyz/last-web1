import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, Heart, Phone, Video, MessageSquare, MoreVertical, ShieldCheck, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DoctorTopNav from "../components/DoctorTopNav";

export default function ChatList() {
    const navigate = useNavigate();
    const { getBookings } = useAuth();
    const bookings = getBookings();

    // Filter doctors to show only those who have been booked
    const chattedDoctors = useMemo(() => {
        const uniqueDoctors = [];
        const seenIds = new Set();
        
        bookings.forEach(b => {
            if (b.doctor && !seenIds.has(b.doctor.id)) {
                uniqueDoctors.push(b.doctor);
                seenIds.add(b.doctor.id);
            }
        });
        
        return uniqueDoctors;
    }, [bookings]);

    return (
        <div className="min-h-screen bg-[#fcfdfe] font-sans flex flex-col pb-20" dir="rtl">
            <DoctorTopNav />
            
            {/* Header Section */}
            <header className="px-6 py-6 flex flex-col gap-6 sticky top-[73px] bg-white/80 backdrop-blur-xl z-30 border-b border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm hover:bg-slate-50 transition-all"
                        >
                            <ArrowRight size={20} />
                        </button>
                        <h1 className="text-2xl font-black text-slate-900">محادثاتي</h1>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="ابحث في محادثاتك..." 
                        className="w-full pr-12 pl-4 py-3.5 bg-slate-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500/50 outline-none transition-all font-medium text-sm"
                    />
                </div>
            </header>

            <main className="flex-1 p-6">
                <div className="space-y-4">
                    {chattedDoctors.map((chat, idx) => (
                        <div 
                            key={chat.id} 
                            className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group" 
                            onClick={() => navigate(`/doctor/chat/${chat.id}`, { state: { doctor: chat } })}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative">
                                    <img 
                                        src={chat.img} 
                                        alt={chat.name} 
                                        className="w-16 h-16 rounded-2xl object-cover shadow-lg" 
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-black text-slate-900 truncate">{chat.name}</h3>
                                        <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 truncate">{chat.role}</p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">نشط الآن</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigate('/doctor/call', { state: { doctor: chat } }); }} 
                                    className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                >
                                    <Phone size={18} />
                                </button>
                                <button className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all">
                                    <ChevronLeft size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {chattedDoctors.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200 mb-8 relative">
                            <div className="absolute inset-0 bg-slate-100 rounded-[40px] scale-110 animate-pulse opacity-50"></div>
                            <MessageSquare size={48} className="relative z-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">لا توجد محادثات نشطة</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed font-medium">
                            يمكنك بدء محادثة مع الأطباء بعد حجز موعد معهم.
                        </p>
                        <button 
                            onClick={() => navigate("/doctor")}
                            className="mt-8 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
                        >
                            تواصل مع طبيب الآن
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}


