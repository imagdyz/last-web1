import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, Star, ArrowRight, MessageSquare, ShieldCheck, ChevronLeft, CalendarCheck } from "lucide-react";
import DoctorTopNav from "../components/DoctorTopNav";
import { useAuth } from "../context/AuthContext";

export default function BookAppointment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { saveBooking } = useAuth();

    const doctor = location.state?.doctor || {
        id: 1,
        name: "د. جينيفر ميلر",
        role: "طبيبة أطفال | مستشفى ميرسي",
        img: 30,
        rating: 4.8,
        time: "10:30ص - 5:30م",
        rate: 25,
    };

    // Dynamic dates starting from today
    const generateDates = () => {
        const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
        const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 4; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const label = i === 0
                ? `اليوم`
                : i === 1
                ? `غداً`
                : `${days[d.getDay()]}`;
            
            const dayNum = d.getDate();
            const monthName = months[d.getMonth()];
            
            dates.push({ id: i + 1, label, dayNum, monthName, value: d.toISOString().split("T")[0] });
        }
        return dates;
    };
    const DATES = generateDates();

    const TIMES = [
        "09:00ص - 09:30ص",
        "09:30ص - 10:00ص",
        "10:00ص - 10:30ص",
        "10:30ص - 11:00ص",
        "11:00ص - 11:30ص",
        "12:00م - 12:30م",
        "01:00م - 01:30م",
        "02:00م - 02:30م",
        "02:30م - 03:00م",
        "03:00م - 03:30م",
        "04:00م - 04:30م",
        "04:30م - 05:00م",
    ];

    const [selectedDate, setSelectedDate] = useState(DATES[0].id);
    const [selectedTime, setSelectedTime] = useState("");
    const [message, setMessage] = useState("");

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans pb-10" dir="rtl">
            <DoctorTopNav />

            {/* Header Overlay */}
            <header className="px-6 py-4 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm hover:bg-slate-50 transition-all"
                >
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-xl font-black text-slate-900">حجز موعد</h1>
            </header>

            <main className="flex-1 px-6 flex flex-col">
                
                {/* Doctor Summary Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-blue-500/5 flex items-center gap-5 border border-slate-100 mb-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
                    <div className="relative">
                        <img 
                            src={doctor.img} 
                            alt={doctor.name} 
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg" 
                        />
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                            <ShieldCheck size={14} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h2 className="font-black text-slate-900 text-lg leading-none">{doctor.name}</h2>
                            <div className="flex items-center gap-1 text-yellow-500 font-black text-xs">
                                <Star size={14} className="fill-yellow-400" /> {doctor.rating}
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mb-2">{doctor.role}</p>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">سعر الكشف: ${doctor.rate}</span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                <Clock size={12} className="text-blue-400" /> {doctor.time}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Date */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                            <CalendarIcon size={20} className="text-blue-600" /> اختر التاريخ
                        </h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                        {DATES.map((d) => {
                            const isActive = d.id === selectedDate;
                            return (
                                <button
                                    key={d.id}
                                    type="button"
                                    onClick={() => setSelectedDate(d.id)}
                                    className={`min-w-[100px] flex flex-col items-center p-4 rounded-[28px] border transition-all duration-300 ${
                                        isActive
                                            ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/30 scale-105"
                                            : "bg-white text-slate-600 border-slate-100 hover:border-blue-200"
                                    }`}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                                        {d.label}
                                    </span>
                                    <span className="text-2xl font-black mb-1">{d.dayNum}</span>
                                    <span className={`text-[10px] font-bold ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>{d.monthName}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section: Time */}
                <div className="mb-10">
                    <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-blue-600" /> اختر الوقت المتاح
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {TIMES.map((t) => {
                            const isActive = t === selectedTime;
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setSelectedTime(t)}
                                    className={`py-4 px-4 rounded-[22px] border text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                                        isActive
                                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                                            : "bg-white text-slate-600 border-slate-100 hover:border-blue-200"
                                    }`}
                                >
                                    <Clock size={14} className={isActive ? 'text-blue-200' : 'text-blue-400'} />
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section: Booking Summary */}
                {selectedTime && (
                    <div className="bg-slate-900 rounded-[32px] p-6 mb-10 text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                        <div className="relative z-10">
                            <h4 className="text-xs font-black text-blue-400 uppercase tracking-[3px] mb-4">ملخص الحجز المبدئي</h4>
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <CalendarCheck size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-black">{DATES.find((d) => d.id === selectedDate)?.label}، {DATES.find((d) => d.id === selectedDate)?.dayNum} {DATES.find((d) => d.id === selectedDate)?.monthName}</p>
                                    <p className="text-[10px] font-bold text-slate-400">الساعة {selectedTime}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400">إجمالي المبلغ</span>
                                <span className="text-2xl font-black">${doctor.rate}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section: Message */}
                <div className="mb-20">
                    <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-blue-600" /> إضافة ملاحظات
                    </h3>
                    <textarea
                        className="w-full h-32 bg-white rounded-[28px] p-6 text-sm font-medium text-slate-700 outline-none border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none shadow-sm"
                        placeholder="اكتب رسالة للطبيب توضح حالتك أو استفسارك..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>

                {/* Action Button */}
                <div className="fixed bottom-0 left-0 w-full p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 rounded-t-[40px]">
                    <button
                        onClick={() => {
                            if (!selectedTime) return;
                            const dateObj = DATES.find((d) => d.id === selectedDate);
                            const bookingData = {
                                doctor,
                                bookedDate: `${dateObj.label}، ${dateObj.dayNum} ${dateObj.monthName}`,
                                bookedTime: selectedTime,
                                note: message,
                            };
                            saveBooking(bookingData);
                            navigate(`/doctor/booking-confirm`, { state: bookingData });
                        }}
                        disabled={!selectedTime}
                        className={`w-full max-w-lg mx-auto py-5 font-black text-lg rounded-[24px] shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group ${
                            selectedTime
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30"
                                : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                        }`}
                    >
                        تأكيد الحجز الآن
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </main>
        </div>
    );
}

