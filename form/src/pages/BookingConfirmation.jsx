import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Calendar, Clock, MessageCircle, Home, Bell, Share2, Printer, ChevronLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function BookingConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addNotification } = useAuth();

    const { doctor, bookedDate, bookedTime, note } = location.state || {};

    useEffect(() => {
        // Notification is now handled by the backend after admin approval.
    }, []);

    if (!doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe]" dir="rtl">
                <div className="text-center animate-in fade-in duration-700">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Home className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-400 font-bold mb-6">لا توجد بيانات حجز حالية</p>
                    <button 
                        onClick={() => navigate("/doctor")} 
                        className="px-10 py-4 bg-blue-600 text-white rounded-[24px] font-black shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all"
                    >
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans pb-10" dir="rtl">
            
            {/* Success Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 pt-20 pb-32 flex flex-col items-center text-white text-center px-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[60px] -ml-20 -mb-20"></div>
                
                <div className="relative z-10 animate-in zoom-in duration-700">
                    <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-[40px] border border-white/20 flex items-center justify-center mb-8 shadow-2xl mx-auto">
                        <CheckCircle2 size={56} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                    </div>
                    <h1 className="text-4xl font-black mb-3 leading-tight tracking-tight">تم تأكيد حجزك!</h1>
                    <p className="text-blue-100/80 text-sm max-w-xs mx-auto font-medium leading-relaxed">
                        تمت جدولة موعدك بنجاح. لقد أرسلنا تفاصيل الموعد إلى بريدك الإلكتروني والاشعارات.
                    </p>
                </div>
            </div>

            {/* Confirmation Card */}
            <div className="px-6 -mt-16 z-20 relative animate-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white rounded-[48px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] p-8 border border-slate-100">
                    
                    {/* Doctor Badge */}
                    <div className="flex items-center gap-5 mb-10 pb-8 border-b border-slate-100 group">
                        <div className="relative">
                            <img
                                src={doctor.img}
                                alt={doctor.name}
                                className="w-20 h-20 rounded-3xl object-cover shadow-xl group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white">
                                <ShieldCheck size={14} />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">موعد مع</p>
                            <h2 className="font-black text-slate-900 text-xl mb-1 leading-none">{doctor.name}</h2>
                            <p className="text-slate-400 text-xs font-bold">{doctor.role}</p>
                        </div>
                    </div>

                    {/* Booking Logistics */}
                    <div className="grid grid-cols-1 gap-6 mb-10">
                        <div className="flex items-center gap-5 p-5 bg-blue-50/50 rounded-[32px] border border-blue-50">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">التاريخ المختار</p>
                                <p className="font-black text-slate-900 text-lg">{bookedDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 p-5 bg-emerald-50/50 rounded-[32px] border border-emerald-50">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                                <Clock size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">التوقيت المحدد</p>
                                <p className="font-black text-slate-900 text-lg">{bookedTime}</p>
                            </div>
                        </div>

                        {note && (
                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-1 h-full bg-slate-200"></div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">ملاحظاتك للطبيب</p>
                                <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{note}"</p>
                            </div>
                        )}
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex gap-4">
                        <button className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-[24px] font-black text-xs border border-slate-100 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                            <Share2 size={16} /> مشاركة
                        </button>
                        <button className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-[24px] font-black text-xs border border-slate-100 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                            <Printer size={16} /> تحميل PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Primary Actions */}
            <div className="px-6 mt-10 space-y-4 max-w-lg mx-auto w-full">
                <button
                    onClick={() => navigate(`/doctor/chat/${doctor.id}`, { state: { doctor } })}
                    className="w-full py-5 bg-blue-600 text-white font-black rounded-[28px] flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-2xl shadow-blue-600/30 text-lg group"
                >
                    <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                    بدء محادثة مع الطبيب
                </button>

                <button
                    onClick={() => navigate("/doctor")}
                    className="w-full py-5 bg-white text-slate-900 font-black rounded-[28px] flex items-center justify-center gap-3 border-2 border-slate-100 hover:bg-slate-50 transition-all text-lg group"
                >
                    <Home size={22} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    العودة للرئيسية
                    <ChevronLeft size={20} className="mr-auto text-slate-300" />
                </button>
            </div>
        </div>
    );
}

