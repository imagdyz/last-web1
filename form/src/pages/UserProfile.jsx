import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LogOut, Calendar, Activity, ChevronLeft, User, Mail, Clock, ShieldCheck, Heart, Award, Bell, Settings, Camera, Check, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DoctorTopNav from "../components/DoctorTopNav";

export default function UserProfile() {
    const navigate = useNavigate();
    const { user, logout, getBookings, getDiagnoses, login } = useAuth();
    const [activeTab, setActiveTab] = useState("bookings");
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        avatarImg: user?.avatarImg || 10
    });

    const bookings = getBookings();
    const diagnoses = getDiagnoses();

    const handleLogout = () => {
        if (window.confirm("هل أنت متأكد من تسجيل الخروج؟")) {
            logout();
            navigate("/login", { replace: true });
        }
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simulate API call
        setTimeout(() => {
            const updatedUser = { ...user, ...formData };
            login(updatedUser);
            setIsSaving(false);
            setSuccessMsg("تم تحديث بياناتك بنجاح! ✨");
            setTimeout(() => setSuccessMsg(""), 3000);
        }, 800);
    };

    const severityColor = (pct) => {
        if (pct >= 75) return "text-rose-500 bg-rose-50 border-rose-100";
        if (pct >= 40) return "text-orange-500 bg-orange-50 border-orange-100";
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
    };

    const avatarOptions = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans pb-20" dir="rtl">
            <DoctorTopNav />

            {/* Profile Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 pt-12 pb-24 flex flex-col items-center text-white px-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[60px] -ml-20 -mb-20"></div>
                
                <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
                    <div className="relative group mb-6">
                        <div className="w-28 h-28 rounded-[40px] overflow-hidden border-4 border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                            <img
                                src={`https://i.pravatar.cc/150?img=${user?.avatarImg || 10}`}
                                alt={user?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button 
                            onClick={() => setActiveTab("settings")}
                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-blue-600 rounded-2xl flex items-center justify-center border-4 border-blue-600 shadow-lg hover:scale-110 transition-all"
                        >
                            <Camera size={18} />
                        </button>
                    </div>
                    
                    <h1 className="text-3xl font-black mb-2 tracking-tight">{user?.name || "مستخدم"}</h1>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                        <Mail size={14} className="text-blue-200" />
                        <span className="text-xs font-bold text-blue-50">{user?.email || "email@example.com"}</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-8 mt-10 w-full max-w-xs">
                        <div className="text-center group">
                            <p className="text-3xl font-black group-hover:scale-110 transition-transform">{bookings.length}</p>
                            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mt-1">الحجوزات</p>
                        </div>
                        <div className="relative flex justify-center">
                            <div className="w-px h-full bg-white/10"></div>
                        </div>
                        <div className="text-center group">
                            <p className="text-3xl font-black group-hover:scale-110 transition-transform">{diagnoses.length}</p>
                            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mt-1">التشخيصات</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs Section */}
            <div className="px-6 -mt-12 z-20 relative animate-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white rounded-[40px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
                    
                    {/* Tab Switcher */}
                    <div className="flex p-2 bg-slate-50/50">
                        <button
                            onClick={() => setActiveTab("bookings")}
                            className={`flex-1 py-4 rounded-3xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-3 ${
                                activeTab === "bookings" 
                                    ? "bg-white text-blue-600 shadow-sm border border-slate-100" 
                                    : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            <Calendar size={18} /> مواعيدي
                        </button>
                        <button
                            onClick={() => setActiveTab("diagnoses")}
                            className={`flex-1 py-4 rounded-3xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-3 ${
                                activeTab === "diagnoses" 
                                    ? "bg-white text-blue-600 shadow-sm border border-slate-100" 
                                    : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            <Activity size={18} /> سجلاتي
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`flex-1 py-4 rounded-3xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-3 ${
                                activeTab === "settings" 
                                    ? "bg-white text-blue-600 shadow-sm border border-slate-100" 
                                    : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            <Settings size={18} /> الإعدادات
                        </button>
                    </div>

                    {/* Tab Content Area */}
                    <div className="p-6 min-h-[350px]">
                        {activeTab === "bookings" && (
                            bookings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 mb-6">
                                        <Calendar size={36} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-1">لا توجد مواعد محجوزة</h3>
                                    <p className="text-slate-400 text-xs">ابدأ باستكشاف الأطباء وحجز أول موعد لك.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((b, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group">
                                            <div className="relative">
                                                <img
                                                    src={b.doctor?.img}
                                                    alt={b.doctor?.name}
                                                    className="w-14 h-14 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform"
                                                />
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-sm">
                                                    <Award size={12} />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-slate-900 truncate">{b.doctor?.name}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                                                        <Calendar size={12} className="text-blue-500" /> {b.bookedDate}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                                                        <Clock size={12} className="text-blue-500" /> {b.bookedTime}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100">مؤكد</span>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {activeTab === "diagnoses" && (
                            diagnoses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 mb-6">
                                        <Activity size={36} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-1">لا توجد سجلات طبية</h3>
                                    <p className="text-slate-400 text-xs">سجل التشخيصات التي تقوم بها سيظهر هنا.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {diagnoses.map((d, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group">
                                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black border transition-colors ${severityColor(d.match)}`}>
                                                <span className="text-lg">{d.match}%</span>
                                                <span className="text-[8px] uppercase tracking-tighter">تطابق</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-slate-900 truncate">{d.name}</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Calendar size={12} className="text-slate-300" />
                                                    <p className="text-[10px] font-bold text-slate-400">
                                                        {new Date(d.date).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all">
                                                <ChevronLeft size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {activeTab === "settings" && (
                            <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in fade-in duration-500">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">اختر صورة الملف الشخصي</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {avatarOptions.map(id => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setFormData({...formData, avatarImg: id})}
                                                className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                                                    formData.avatarImg === id ? "border-blue-600 scale-105 shadow-lg shadow-blue-600/20" : "border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                                }`}
                                            >
                                                <img src={`https://i.pravatar.cc/100?img=${id}`} alt="" className="w-full h-full object-cover" />
                                                {formData.avatarImg === id && (
                                                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                                        <Check size={20} className="text-blue-600 bg-white rounded-full p-0.5" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">الاسم بالكامل</label>
                                        <div className="relative">
                                            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900" 
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">البريد الإلكتروني</label>
                                        <div className="relative">
                                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="email" 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900" 
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {successMsg && (
                                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-xs font-bold text-center animate-bounce">
                                        {successMsg}
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    {isSaving ? "جاري الحفظ..." : <><Save size={20} /> حفظ التعديلات</>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="px-6 mt-10 grid grid-cols-1 gap-4 max-w-lg mx-auto w-full">
                <button 
                    onClick={() => navigate("/notifications")}
                    className="w-full py-5 bg-white border-2 border-slate-100 rounded-[28px] flex items-center px-6 gap-4 hover:bg-slate-50 transition-all group"
                >
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Bell size={24} />
                    </div>
                    <div className="text-right">
                        <p className="font-black text-slate-900 text-sm">الإشعارات</p>
                        <p className="text-[10px] font-bold text-slate-400">تحقق من التنبيهات الجديدة</p>
                    </div>
                    <ChevronLeft size={20} className="mr-auto text-slate-300" />
                </button>
                
                <button
                    onClick={handleLogout}
                    className="w-full py-5 bg-rose-50 border-2 border-rose-100 rounded-[28px] flex items-center px-6 gap-4 hover:bg-rose-100 transition-all group"
                >
                    <div className="w-12 h-12 bg-white text-rose-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
                        <LogOut size={24} />
                    </div>
                    <div className="text-right">
                        <p className="font-black text-rose-600 text-sm">تسجيل الخروج</p>
                        <p className="text-[10px] font-bold text-rose-400">نراك قريباً!</p>
                    </div>
                    <ChevronLeft size={20} className="mr-auto text-rose-300" />
                </button>
            </div>
        </div>
    );
}


