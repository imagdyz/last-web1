import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart as HeartIcon, Bell, Calendar, Star, MapPin, ChevronLeft, ArrowLeft, Filter, Sparkles, Stethoscope } from "lucide-react";

import { DOCTORS } from '../data/doctors';
import DoctorTopNav from "../components/DoctorTopNav";
import { useAuth } from "../context/AuthContext";

const SPECIALTIES = ["الكل", "جهاز هضمي", "باطنة", "جراحة", "تغذية", "كبد", "عام"];

const SPEC_MAP = {
    "الكل": "All",
    "جهاز هضمي": "Gastroenterology",
    "باطنة": "Internal Medicine",
    "جراحة": "General Surgery",
    "تغذية": "Nutrition",
    "كبد": "Hepatology",
    "عام": "General"
};

export default function DoctorHome() {
    const navigate = useNavigate();
    const { user, getBookings, getNotifications } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState([1, 3]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [selectedSpec, setSelectedSpec] = useState("الكل");
    const searchInputRef = React.useRef(null);

    const bookings = getBookings().slice(0, 3);
    const unreadCount = getNotifications().filter(n => !n.read).length;

    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    };

    const filteredDoctors = DOCTORS.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFavorite = showFavoritesOnly ? favorites.includes(doc.id) : true;
        const mappedSpec = SPEC_MAP[selectedSpec];
        const matchesSpec = mappedSpec === "All" || doc.spec === mappedSpec;
        return matchesSearch && matchesFavorite && matchesSpec;
    });

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans" dir="rtl">
            <DoctorTopNav />

            {/* Header / Greeting */}
            <div className="px-6 pt-8 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl overflow-hidden p-[2px] shadow-lg shadow-blue-500/20">
                                <div className="w-full h-full bg-white rounded-[14px] overflow-hidden">
                                    <img 
                                        src={`https://i.pravatar.cc/150?u=${user?.email}`} 
                                        alt="User" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">مرحباً بك، 👋</p>
                            <h1 className="text-2xl font-black text-slate-900 leading-tight">{user?.name || "المستخدم"}</h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate("/notifications")}
                            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm hover:text-blue-600 transition-all relative"
                        >
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span className="absolute top-3 right-3 w-4 h-4 bg-rose-500 border-2 border-white rounded-full"></span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Search size={20} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="ابحث عن طبيب، تخصص، أو حالة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-14 pl-6 py-4.5 bg-white border border-slate-100 rounded-[24px] outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold shadow-sm placeholder:text-slate-300"
                    />
                    <button className="absolute left-3 top-2 w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Quick Actions / Checkup Button */}
            <div className="px-6 py-2">
                <button 
                    onClick={() => navigate("/step1")}
                    className="w-full bg-gradient-to-l from-indigo-600 via-blue-600 to-blue-500 p-6 rounded-[32px] flex items-center justify-between shadow-xl shadow-blue-600/20 group hover:scale-[1.02] transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                            <Stethoscope size={28} />
                        </div>
                        <div className="text-right">
                            <h3 className="text-lg font-black text-white">بدء فحص طبي جديد</h3>
                            <p className="text-blue-100 text-xs font-bold opacity-80 mt-0.5">شخص حالتك الآن بالذكاء الاصطناعي</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:translate-x-[-4px] transition-transform">
                        <ChevronLeft size={20} />
                    </div>
                </button>
            </div>

            <main className="flex-1 pb-10">
                
                {/* Upcoming Appointments */}
                <section className="mt-4">
                    <div className="px-6 flex items-center justify-between mb-5">
                        <h2 className="text-lg font-black text-slate-900">المواعيد القادمة</h2>
                        {bookings.length > 0 && (
                            <button 
                                onClick={() => navigate("/doctor/my-appointments")}
                                className="text-blue-600 text-xs font-black hover:text-blue-700 transition-colors"
                            >
                                عرض الكل
                            </button>
                        )}
                    </div>
                    
                    <div className="px-6 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {bookings.length > 0 ? (
                            bookings.map((b, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-blue-700 to-blue-500 text-white rounded-[32px] p-6 min-w-[300px] shadow-xl shadow-blue-500/20 shrink-0 relative overflow-hidden group">
                                    <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl border border-white/20 p-1">
                                                    <img src={b.doctor?.img} alt={b.doctor?.name} className="w-full h-full rounded-xl object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold truncate max-w-[140px]">{b.doctor?.name}</h3>
                                                    <p className="text-blue-100 text-[10px] font-medium uppercase tracking-wider">{b.doctor?.role?.split(" | ")[0]}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                                {b.doctor?.rating}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center justify-center gap-2 border border-white/5">
                                                <Calendar size={14} className="text-blue-200" />
                                                <span className="text-xs font-bold">{b.bookedDate}</span>
                                            </div>
                                            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center justify-center gap-2 border border-white/5">
                                                <span className="text-xs font-bold">🕒 {b.bookedTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full bg-white rounded-[32px] border border-dashed border-slate-200 py-10 flex flex-col items-center justify-center text-center gap-3 mx-6">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                    <Calendar size={32} />
                                </div>
                                <div>
                                    <p className="text-slate-900 font-black text-sm">لا توجد مواعيد نشطة</p>
                                    <p className="text-slate-400 text-xs mt-1">احجز موعداً الآن مع أفضل الأطباء</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Specialty Filter */}
                <section className="mt-8">
                    <div className="px-6 mb-5 flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-900">تخصصات الأطباء</h2>
                    </div>
                    <div className="px-6 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {SPECIALTIES.map(spec => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpec(spec)}
                                className={`px-6 py-3.5 rounded-[20px] text-xs font-black whitespace-nowrap transition-all duration-300 border ${
                                    selectedSpec === spec
                                        ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10"
                                        : "bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:bg-slate-50 shadow-sm"
                                }`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Doctors List */}
                <section className="mt-8 px-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900">
                                {showFavoritesOnly ? "المفضلة" : "الأطباء المتاحون"}
                            </h2>
                            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-lg">{filteredDoctors.length}</span>
                        </div>
                        <button 
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            className={`flex items-center gap-2 text-xs font-bold transition-colors ${showFavoritesOnly ? 'text-rose-500' : 'text-slate-400 hover:text-blue-600'}`}
                        >
                            {showFavoritesOnly ? <Sparkles size={16}/> : <HeartIcon size={16}/>}
                            {showFavoritesOnly ? "عرض الكل" : "المفضلون"}
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map(doc => (
                                <div 
                                    key={doc.id} 
                                    className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 shadow-sm border border-slate-50 flex flex-col gap-4 sm:gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
                                >
                                    {/* Glass Decor */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-100/50 transition-colors"></div>

                                    <div className="flex justify-between items-start relative z-10">
                                        <div
                                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 cursor-pointer flex-1"
                                            onClick={() => navigate(`/doctor/profile/${doc.id}`, { state: { doctor: doc } })}
                                        >
                                            <div className="relative shrink-0">
                                                <img src={doc.img} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                                                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{doc.name}</h3>
                                                <p className="text-xs text-slate-400 font-medium mb-2">{doc.role}</p>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
                                                        {SPECIALTIES.find(s => SPEC_MAP[s] === doc.spec) || doc.spec}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-full">
                                                        <MapPin size={12} />
                                                        <span>متاح الآن</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleFavorite(doc.id)} 
                                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${favorites.includes(doc.id) ? 'bg-rose-50 text-rose-500 shadow-sm' : 'bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-400'}`}
                                        >
                                            <HeartIcon size={20} className={favorites.includes(doc.id) ? "fill-rose-500" : ""} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 relative z-10">
                                        <button
                                            onClick={() => navigate(`/doctor/profile/${doc.id}`, { state: { doctor: doc } })}
                                            className="flex-1 py-4 bg-blue-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            حجز موعد جديد
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                                            <Sparkles size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={40} className="text-slate-200" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">عذراً، لم نجد نتائج</h3>
                                <p className="text-slate-400 text-sm mt-2 px-10">جرب البحث بكلمات مختلفة أو تغيير التخصص المختار</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

