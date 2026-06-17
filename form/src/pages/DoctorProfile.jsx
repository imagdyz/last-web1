import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Search, Heart, Clock, Star, ShieldCheck, MapPin, Award, CheckCircle2, ChevronLeft, Info } from "lucide-react";

import { DOCTORS } from '../data/doctors';
import DoctorTopNav from "../components/DoctorTopNav";

export default function DoctorProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const doctorId = Number(id);
    const doctor =
        location.state?.doctor ||
        DOCTORS.find((d) => d.id === doctorId) ||
        DOCTORS[0];

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans pb-10" dir="rtl">
            <DoctorTopNav />
            
            {/* Header Overlay */}
            <header className="fixed top-[73px] left-0 w-full z-20 px-6 py-4 flex justify-between items-center pointer-events-none">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl pointer-events-auto hover:bg-white hover:text-slate-900 transition-all"
                >
                    <ArrowRight size={24} />
                </button>
                <div className="flex gap-2 pointer-events-auto">
                    <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl hover:bg-white hover:text-rose-500 transition-all">
                        <Heart size={22} />
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative h-[380px] w-full bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[80px] -ml-40 -mb-40"></div>
                
                <div className="absolute inset-0 flex items-end justify-center px-6">
                    <div className="relative group">
                        <img 
                            src={doctor.img} 
                            alt={doctor.name} 
                            className="h-[340px] w-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute bottom-10 -right-4 bg-white px-4 py-2 rounded-2xl shadow-2xl z-20 flex items-center gap-2 animate-bounce">
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-xs font-black text-slate-900">طبيب موثق</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 bg-white rounded-t-[48px] -mt-12 relative z-30 shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.1)] px-8 pt-10 pb-40">
                
                {/* Basic Info */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-widest">
                                {doctor.spec || "تخصص عام"}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-500 text-xs font-black">
                                <Star size={14} className="fill-yellow-400" />
                                {doctor.rating} (120 تقييم)
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{doctor.name}</h1>
                        <div className="flex items-center gap-4 text-slate-400 font-bold text-xs">
                            <p className="flex items-center gap-1.5">
                                <Award size={16} className="text-blue-500" /> {doctor.role}
                            </p>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <p className="flex items-center gap-1.5">
                                <Clock size={16} className="text-blue-500" /> {doctor.time}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-slate-50 rounded-[28px] p-5 border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-blue-600 hover:border-blue-600 transition-all duration-300">
                        <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">15 سنة</p>
                        <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-100 transition-colors uppercase tracking-widest mt-1">الخبرة</p>
                    </div>
                    <div className="bg-slate-50 rounded-[28px] p-5 border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-blue-600 hover:border-blue-600 transition-all duration-300">
                        <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">1.2K</p>
                        <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-100 transition-colors uppercase tracking-widest mt-1">مريض</p>
                    </div>
                    <div className="bg-slate-50 rounded-[28px] p-5 border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-blue-600 hover:border-blue-600 transition-all duration-300">
                        <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{doctor.rate} ج.م</p>
                        <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-100 transition-colors uppercase tracking-widest mt-1">سعر الكشف</p>
                    </div>
                </div>

                {/* Success Notification if booked */}
                {location.state?.bookedDate && location.state?.bookedTime && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-6 mb-10 animate-in zoom-in duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-emerald-900 text-lg leading-none mb-2">تم تأكيد الحجز!</h3>
                                <p className="text-emerald-700/80 text-sm font-medium">
                                    موعدك في <span className="font-black underline">{location.state.bookedDate}</span> الساعة <span className="font-black underline">{location.state.bookedTime}</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* About Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Info size={20} className="text-blue-600" /> نبذة عن الطبيب
                    </h3>
                    <p className="text-slate-500 leading-relaxed font-medium">
                        الدكتور {doctor.name} هو خبير متميز في {doctor.spec || "تخصصه الطبي"}، يمتلك مسيرة مهنية حافلة بالنجاحات لأكثر من 15 عاماً. يتخصص في تشخيص وعلاج الحالات المعقدة باستخدام أحدث التقنيات الطبية العالمية، مع التركيز على راحة المريض وتقديم خطة علاجية مخصصة لكل حالة.
                    </p>
                    
                    <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">موقع العيادة</p>
                                <p className="text-xs font-bold text-slate-900">حي المعادي، البرج الطبي التخصصي</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Button Fixed */}
                <div className="fixed bottom-0 left-0 w-full p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 rounded-t-[40px] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={() => navigate(`/doctor/book/${doctor.id}`, { state: { doctor } })}
                        className="w-full max-w-lg mx-auto py-5 bg-blue-600 text-white font-black text-lg rounded-[24px] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 group"
                    >
                        حجز موعد الآن
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </main>
        </div>
    );
}

