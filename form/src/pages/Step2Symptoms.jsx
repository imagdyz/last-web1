import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    ArrowRight, Search, Check, Menu, FilterX,
    Flame, Activity, Stethoscope, AlertTriangle, BatteryWarning, Frown,
    CloudRain, Wind, Droplets, Zap, Droplet, RefreshCw, CircleDashed,
    AlertCircle, Eye, UtensilsCrossed, Scale, BatteryLow, HeartPulse, Siren
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logoImg from "../../public/logo.jpeg";

const RED_FLAGS = [
    "إسهال دموي",
    "ألم شديد أعلى البطن",
    "صعوبة بلع",
    "فقدان وزن غير مبرر",
    "ألم شديد في المعدة",
    "نزيف من الشرج أو مع البراز"
];

const StomachIcon = ({ size = 24, className, ...props }) => (
    <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className || ''}`} {...props}>
        <img 
            src={logoImg} 
            alt="صورة المعدة" 
            className="w-full h-full object-contain scale-110 mix-blend-multiply drop-shadow-sm rounded-full" 
        />
    </div>
);

const SYMPTOM_ICONS = {
    "حموضة": Flame,
    "ألم أعلى البطن": Activity,
    "ألم بالصدر": HeartPulse,
    "صعوبة بلع": Frown,
    "حرقة مزمنة بالمريء": Flame,
    "فقدان وزن غير مبرر": Scale,
    "ألم في المعدة": StomachIcon,
    "ألم شديد في المعدة": AlertTriangle,
    "غثيان أو قيء": CloudRain,
    "سوء هضم": Frown,
    "إسهال متكرر": Wind,
    "انتفاخ البطن": CircleDashed,
    "كثرة الغازات": Wind,
    "ألم بطن": StomachIcon,
    "نقص فيتامينات أو عناصر غذائية": BatteryWarning,
    "تقلصات بالبطن": Zap,
    "إسهال دموي": Droplet,
    "إسهال متكرر أو إمساك متكرر": RefreshCw,
    "شعور بعدم اكتمال حركة الأمعاء": AlertCircle,
    "نزيف من الشرج أو مع البراز": Droplet,
    "ألم أثناء التبرز": AlertTriangle,
    "ألم شديد أعلى البطن": AlertTriangle,
    "إفرازات من الشرج": Droplets,
    "تعب عام وإرهاق": BatteryLow,
    "تورم البطن (استسقاء)": CircleDashed,
    "اصفرار الجلد أو العينين": Eye,
    "ألم بالبطن بعد الأكل الدسم": UtensilsCrossed,
    "ألم مزمن بالبطن": Activity
};

function Step2Symptoms() {
    const navigate = useNavigate();
    const location = useLocation();
    const { medicalData } = useAuth();
    
    const initialOrgan = location.state?.organ || null;
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [activeFilter, setActiveFilter] = useState(initialOrgan);

    if (!medicalData) {
        return (
            <div className="min-h-screen bg-[#f8fafe] flex items-center justify-center font-sans" dir="rtl">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-800 font-bold">جاري تحميل البيانات الطبية...</p>
                </div>
            </div>
        );
    }

    const SYMPTOMS_BY_ORGAN = medicalData.SYMPTOMS_BY_ORGAN || {};
    const ALL_SYMPTOMS = [...new Set(Object.values(SYMPTOMS_BY_ORGAN).flat())];

    const displayedSymptoms = (activeFilter ? SYMPTOMS_BY_ORGAN[activeFilter] || ALL_SYMPTOMS : ALL_SYMPTOMS)
        .filter((symptom) => symptom.toLowerCase().includes(searchTerm.toLowerCase()));

    const toggleSymptom = (symptom) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom)
                ? prev.filter((s) => s !== symptom)
                : [...prev, symptom]
        );
    };

    const clearAll = () => setSelectedSymptoms([]);

    const handleContinue = () => {
        navigate("/step2-skeleton", { state: { symptoms: selectedSymptoms } });
    };

    const hasRedFlag = selectedSymptoms.some(s => RED_FLAGS.includes(s));

    return (
        <div className="min-h-screen bg-[#f8fafe] flex flex-col font-sans" dir="rtl">
            <header className="bg-blue-500 text-white py-4 px-4 flex items-center justify-between sticky top-0 z-10 w-full">
                <h1 className="text-xl font-bold mx-auto">تقييم الأعراض</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-4 text-white hover:text-blue-100 transition"
                >
                    <ArrowRight size={24} />
                </button>
            </header>

            <main className="flex-1 w-full max-w-md mx-auto flex flex-col relative pb-24">

                <div className="sticky top-[60px] bg-[#f8fafe] z-10 px-4 pt-4 pb-2 space-y-4">
                    
                    {hasRedFlag && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm flex items-start gap-3 animate-pulse-slow">
                            <Siren className="text-red-500 shrink-0 mt-0.5" size={24} />
                            <div>
                                <h3 className="text-red-800 font-bold text-sm">تنبيه طوارئ 🚨</h3>
                                <p className="text-red-700 text-xs mt-1 leading-relaxed font-medium">
                                    لقد اخترت عرضاً أو أكثر قد يشير إلى حالة طبية تتطلب تدخلاً عاجلاً. يُنصح بشدة بزيارة أقرب طوارئ أو طبيب في أسرع وقت.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {activeFilter && (
                        <div className="flex items-center justify-between bg-white border border-blue-200 p-3 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">الأعراض المرتبطة بـ:</span>
                                <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">{activeFilter}</span>
                            </div>
                            <button 
                                onClick={() => setActiveFilter(null)}
                                className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-medium"
                            >
                                <FilterX size={14} />
                                عرض الكل
                            </button>
                        </div>
                    )}

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="ابحث عن الأعراض..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                    </div>

                    <div className="flex items-center justify-between bg-blue-50/50 rounded-2xl p-2 border border-blue-100">
                        {selectedSymptoms.length > 0 ? (
                            <button
                                onClick={clearAll}
                                className="px-4 py-2 text-red-500 bg-red-50 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-red-100 transition"
                            >
                                مسح الكل
                                <Menu size={16} />
                            </button>
                        ) : (
                            <div className="px-4 py-2"></div>
                        )}
                        <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                            <span>{selectedSymptoms.length} أعراض محددة</span>
                            <div className="bg-blue-500 text-white p-1 rounded-full">
                                <Check size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-3 py-2 grid grid-cols-3 gap-2 overflow-y-auto content-start">
                    {displayedSymptoms.map((symptom) => {
                        const isSelected = selectedSymptoms.includes(symptom);
                        const IconComponent = SYMPTOM_ICONS[symptom] || Activity;
                        
                        return (
                            <div
                                key={symptom}
                                onClick={() => toggleSymptom(symptom)}
                                className={`flex flex-col items-center justify-center text-center p-2 rounded-lg border transition-all duration-200 cursor-pointer min-h-[120px] gap-2 ${
                                    isSelected
                                        ? "border-[#1c4da1] bg-[#f2f6fc]"
                                        : "border-gray-100 bg-white hover:border-blue-200"
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-sm shrink-0 transition-colors ${
                                    isSelected 
                                        ? "bg-blue-100 text-blue-700 border border-blue-200" 
                                        : "bg-[#f8fafe] text-blue-500 border border-gray-100"
                                }`}>
                                    <IconComponent size={24} strokeWidth={1.8} />
                                </div>
                                <span className={`text-xs leading-snug font-extrabold ${isSelected ? "text-blue-900" : "text-[#101828]"}`}>
                                    {symptom}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-[#f8fafe] via-[#f8fafe] to-transparent w-full">
                <div className="max-w-md mx-auto flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all shadow-sm"
                    >
                        رجوع
                    </button>
                    <button
                        onClick={handleContinue}
                        disabled={selectedSymptoms.length === 0}
                        className={`flex-[2] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${selectedSymptoms.length > 0
                            ? "bg-linear-to-r from-teal-500 to-blue-500 text-white hover:opacity-90"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        المتابعة إلى اختيار الحالة
                        <ArrowRight size={20} className="transform rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Step2Symptoms;
