import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Clock, MapPin, ChevronLeft, Phone, MoreVertical, ShieldCheck, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DoctorTopNav from "../components/DoctorTopNav";

export default function MyAppointments() {
    const navigate = useNavigate();
    const { getBookings, updateBookingStatus } = useAuth();
    const bookings = getBookings();

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
                        <h1 className="text-2xl font-black text-slate-900">مواعيدي</h1>
                    </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                    <button className="px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-full shadow-lg shadow-blue-600/20 whitespace-nowrap">الكل ({bookings.length})</button>
                    <button className="px-6 py-2.5 bg-white text-slate-400 border border-slate-100 text-xs font-black rounded-full whitespace-nowrap">القادمة</button>
                    <button className="px-6 py-2.5 bg-white text-slate-400 border border-slate-100 text-xs font-black rounded-full whitespace-nowrap">السابقة</button>
                </div>
            </header>

            <main className="flex-1 p-6">
                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200 mb-8 relative">
                            <div className="absolute inset-0 bg-slate-100 rounded-[40px] scale-110 animate-pulse opacity-50"></div>
                            <Calendar size={48} className="relative z-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">لا توجد مواعيد محجوزة</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed font-medium">
                            لم تقم بحجز أي مواعيد حتى الآن. ابحث عن طبيبك المفضل وابدأ رحلة العلاج.
                        </p>
                        <button 
                            onClick={() => navigate("/doctor")}
                            className="mt-8 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
                        >
                            استكشف الأطباء الآن
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking, idx) => (
                            <div 
                                key={idx} 
                                className={`bg-white rounded-[32px] p-6 border shadow-xl shadow-slate-200/20 flex flex-col gap-6 hover:scale-[1.01] transition-all group ${
                                    booking.status === 'suggested' ? 'border-blue-200' : 'border-slate-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img 
                                                src={booking.doctor?.img || `https://i.pravatar.cc/150?u=${booking.doctor_name}`} 
                                                alt={booking.doctor_name} 
                                                className="w-16 h-16 rounded-2xl object-cover shadow-lg" 
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-lg flex items-center justify-center border-2 border-white">
                                                <Award size={12} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-black text-slate-900">{booking.doctor_name}</h3>
                                                <ShieldCheck size={14} className="text-blue-500" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-400">{booking.doctor_role || 'أخصائي الجهاز الهضمي'}</p>
                                        </div>
                                    </div>
                                    <button className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all">
                                        <Phone size={18} />
                                    </button>
                                </div>

                                {booking.status === 'suggested' && (
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={16} className="text-blue-600" />
                                            <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">موعد مقترح من العيادة</p>
                                        </div>
                                        <p className="text-sm font-bold text-blue-900 mb-3">{booking.alternativeTime}</p>
                                        <button 
                                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                            className="w-full py-3 bg-blue-600 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-600/20"
                                        >
                                            قبول الموعد الجديد
                                        </button>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100/50">
                                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <Calendar size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التاريخ</p>
                                            <p className="text-xs font-black text-slate-900">{booking.bookedDate}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100/50">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <Clock size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الوقت</p>
                                            <p className="text-xs font-black text-slate-900">{booking.bookedTime}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            booking.status === 'confirmed' ? 'bg-emerald-500 animate-pulse' : 
                                            booking.status === 'suggested' ? 'bg-blue-500' : 'bg-amber-500 animate-pulse'
                                        }`}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-[2px] ${
                                            booking.status === 'confirmed' ? 'text-emerald-600' : 
                                            booking.status === 'suggested' ? 'text-blue-600' : 'text-amber-600'
                                        }`}>
                                            {booking.status === 'confirmed' ? 'موعد مؤكد' : 
                                             booking.status === 'suggested' ? 'موعد مقترح' : 'بانتظار الموافقة'}
                                        </span>
                                    </div>
                                    <button className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:gap-3 transition-all">
                                        تفاصيل الموعد
                                        <ChevronLeft size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
