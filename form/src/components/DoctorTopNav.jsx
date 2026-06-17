import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, Bot, User, ArrowRight, LogOut, ShieldCheck, Stethoscope } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DoctorTopNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleHomeClick = () => {
        const isFromMedicalVisits = sessionStorage.getItem("fromMedicalVisits") === "true";
        const medicalCondition = sessionStorage.getItem("medicalCondition");

        if (isFromMedicalVisits && medicalCondition) {
            navigate("/doctor/list", { state: { condition: JSON.parse(medicalCondition) } });
        } else {
            navigate("/doctor/home");
        }
    };

    const handleLogout = () => {
        if (window.confirm("هل أنت متأكد من تسجيل الخروج؟")) {
            logout();
            navigate("/login", { replace: true });
        }
    };

    const navItems = [
        {
            icon: <Stethoscope size={18} />,
            label: "الفحص الطبي",
            onClick: () => navigate("/step1"),
            isActive: location.pathname.startsWith("/step"),
        },
        {
            icon: <Home size={18} />,
            label: "الرئيسية",
            onClick: handleHomeClick,
            isActive: location.pathname === "/doctor" || location.pathname === "/doctor/home",
        },
        {
            icon: <Calendar size={18} />,
            label: "مواعيدي",
            onClick: () => navigate("/doctor/my-appointments"),
            isActive: location.pathname === "/doctor/my-appointments",
        },
        {
            icon: <User size={18} />,
            label: "حسابي",
            onClick: () => navigate("/profile"),
            isActive: location.pathname === "/profile",
        },
    ];

    return (
        <nav className="sticky top-0 left-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center transition-all duration-300" dir="rtl">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                     <ShieldCheck size={22} />
                 </div>
                 <div className="hidden sm:block">
                    <h1 className="text-lg font-black text-slate-900 leading-none">STOMACH</h1>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">Medical Hub</p>
                 </div>
             </div>

            <div className="flex bg-slate-50/80 backdrop-blur-md p-1.5 rounded-[24px] border border-slate-100 shadow-inner">
                {navItems.map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={item.onClick}
                        className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-xs font-black transition-all duration-300 ${
                            item.isActive ? "bg-white text-blue-600 shadow-md translate-y-[-1px]" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
