import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Info, FileText, Home, ListChecks, CheckCircle2, XCircle, Share2, Check, Printer } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const diseaseFoodsMapping = {
    "ارتجاع المريء": {
        harmful: ["الأكل الدسم", "القهوة", "الشوكولاتة", "الأطعمة الحارة"],
        beneficial: ["الشوفان", "الموز", "الخضار المسلوق"]
    },
    "مريء باريت": {
        harmful: ["الدهون", "المقليات", "الكحول"],
        beneficial: ["الخضروات", "الفواكه", "الأطعمة قليلة الدهون"]
    },
    "سرطان المريء": {
        harmful: ["الكحول", "التدخين", "الأطعمة الحارة"],
        beneficial: ["أطعمة غنية بالبروتين", "خضروات", "شوربة"]
    },
    "تقلصات المريء": {
        harmful: ["الكافيين", "الأطعمة القاسية"],
        beneficial: ["أطعمة خفيفة", "زبادي", "خضار"]
    },
    "جرثومة المعدة": {
        harmful: ["الأكل الحار", "المقليات", "القهوة"],
        beneficial: ["الزبادي", "العسل", "البروكلي"]
    },
    "التهاب المعدة المزمن": {
        harmful: ["الكحول", "التوابل", "المقليات"],
        beneficial: ["الأرز", "الموز", "البطاطس المسلوقة"]
    },
    "قرحة المعدة": {
        harmful: ["القهوة", "الأكل الحار", "التدخين"],
        beneficial: ["الشوفان", "العسل", "اللبن"]
    },
    "سرطان المعدة": {
        harmful: ["اللحوم المصنعة", "الأطعمة المدخنة"],
        beneficial: ["بروتينات خفيفة", "خضروات"]
    },
    "السيلياك": {
        harmful: ["القمح", "الشعير", "الجلوتين"],
        beneficial: ["الأرز", "الذرة", "البطاطس"]
    },
    "نمو بكتيري زائد": {
        harmful: ["السكريات", "الأطعمة المصنيعة"],
        beneficial: ["الزبادي", "الأطعمة قليلة السكر"]
    },
    "داء كرون": {
        harmful: ["الأطعمة الدسمة", "الأطعمة الحارة"],
        beneficial: ["الأرز", "الدجاج", "الموز"]
    },
    "سوء الامتصاص": {
        harmful: ["الأطعمة المصنعة"],
        beneficial: ["أطعمة غنية بالفيتامينات"]
    },
    "القولون العصبي": {
        harmful: ["الفاصوليا", "الكافيين", "الأطعمة الحارة"],
        beneficial: ["الشوفان", "الزبادي", "النعناع"]
    },
    "القولون التقرحي": {
        harmful: ["المقليات", "الأطعمة الحارة"],
        beneficial: ["الأرز", "البطاطس", "البروتين الخفيف"]
    },
    "زوائد قولونية": {
        harmful: ["اللحوم المصنعة"],
        beneficial: ["الخضروات", "الألياف"]
    },
    "سرطان القولون": {
        harmful: ["اللحوم المصنعة", "الدهون"],
        beneficial: ["الخضروات", "الفواكه", "الألياف"]
    },
    "البواسير": {
        harmful: ["الإمساك", "الأطعمة الحارة"],
        beneficial: ["الألياف", "الماء", "الخضروات"]
    },
    "الشق الشرجي": {
        harmful: ["الأطعمة التي تسبب الإمساك"],
        beneficial: ["الألياف", "الفواكه"]
    },
    "الناسور الشرجي": {
        harmful: ["الأطعمة الملوثة"],
        beneficial: ["غذاء صحي متوازن"]
    },
    "سرطان المستقيم": {
        harmful: ["اللحوم المصنعة"],
        beneficial: ["ألياف", "خضروات"]
    },
    "الكبد الدهني": {
        harmful: ["الدهون", "السكريات"],
        beneficial: ["الخضروات", "السمك", "زيت الزيتون"]
    },
    "تليف الكبد": {
        harmful: ["الكحول", "الدهون"],
        beneficial: ["البروتين الخفيف", "الخضار"]
    },
    "فيروس سي": {
        harmful: ["الكحول", "الدهون"],
        beneficial: ["غذاء صحي", "فواكه"]
    },
    "سرطان الكبد": {
        harmful: ["الكحول", "الأطعمة الملوثة"],
        beneficial: ["أطعمة مغذية", "بروتين"]
    },
    "حصوات المرارة": {
        harmful: ["الدهون", "المقليات"],
        beneficial: ["خضروات", "فواكه", "ألياف"]
    },
    "التهاب المرارة": {
        harmful: ["الدهون"],
        beneficial: ["أطعمة خفيفة"]
    },
    "انسداد القناة المرارية": {
        harmful: ["الدهون الثقيلة"],
        beneficial: ["أطعمة قليلة الدهون"]
    },
    "سرطان المرارة": {
        harmful: ["الدهون والمقليات"],
        beneficial: ["غذاء صحي"]
    },
    "التهاب البنكرياس الحاد": {
        harmful: ["الكحول", "الدهون"],
        beneficial: ["أطعمة خفيفة", "سوائل"]
    },
    "التهاب البنكرياس المزمن": {
        harmful: ["الكحول", "المقليات"],
        beneficial: ["أطعمة قليلة الدهون"]
    },
    "سرطان البنكرياس": {
        harmful: ["الدهون الثقيلة"],
        beneficial: ["بروتين خفيف", "خضروات"]
    },
    "قصور البنكرياس": {
        harmful: ["الأطعمة الدسمة"],
        beneficial: ["أطعمة سهلة الهضم"]
    }
};

function Step4Result() {
    const navigate = useNavigate();
    const location = useLocation();
    const { saveDiagnosis, addNotification } = useAuth();
    const [copied, setCopied] = useState(false);
    const symptoms = location.state?.symptoms || [];
    const condition = location.state?.condition || { name: "غير محدد", match: 0, symptoms: [] };

    const percentage = condition.match || 0;
    const score = (percentage * 0.207).toFixed(1);

    const size = 256;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const conditionSymptoms = condition.symptoms || [];
    const matchedSymptoms = conditionSymptoms.filter((s) => symptoms.includes(s));

    let severityLabel = "منخفضة";
    let severityColor = "bg-green-500";
    let strokeColor = "#22c55e";
    let textColor = "text-green-500";
    let shadowColor = "shadow-green-500/20";

    if (percentage >= 75) {
        severityLabel = "عالية";
        severityColor = "bg-[#f05349]";
        strokeColor = "#f05349";
        textColor = "text-[#f05349]";
        shadowColor = "shadow-red-500/20";
    } else if (percentage >= 40) {
        severityLabel = "متوسطة";
        severityColor = "bg-orange-500";
        strokeColor = "#f97316";
        textColor = "text-orange-500";
        shadowColor = "shadow-orange-500/20";
    }

    useEffect(() => {
        if (condition.name !== "غير محدد") {
            saveDiagnosis(condition);
            addNotification({
                type: "diagnosis",
                title: "تشخيص جديد 🫠",
                message: `تم تشخيصك بـ “${condition.name}” بنسبة تطابق ${condition.match}%`,
            });
        }
    }, []);

    const handleShare = () => {
        const text = `نتيجة التشخيص - Stomach Support
الحالة: ${condition.name}
نسبة التطابق: ${condition.match}%
الشدة: ${severityLabel}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans print:bg-white" dir="rtl">
            
            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block text-center mb-8 border-b-2 border-blue-500 pb-6 pt-4">
                <h1 className="text-4xl font-extrabold text-blue-800 mb-2">Stomach Support</h1>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">تقرير طبي المبدئي</h2>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                    <p>تاريخ التقرير: {new Date().toLocaleDateString("ar-EG")}</p>
                    <p>وقت التقرير: {new Date().toLocaleTimeString("ar-EG")}</p>
                </div>
                
                <div className="mt-4 p-5 bg-blue-50 rounded-xl border-2 border-blue-100 text-right grid gap-3">
                    <p className="text-lg">
                        <strong className="text-blue-900">اسم المريض:</strong>{" "}
                        <span className="font-bold">{localStorage.getItem("auth_user") ? JSON.parse(localStorage.getItem("auth_user")).name : "غير مسجل"}</span>
                    </p>
                    <p className="text-lg">
                        <strong className="text-blue-900">الحالة المحتملة:</strong>{" "}
                        <span className="font-bold text-gray-800">{condition.name} (بنسبة {condition.match}%)</span>
                    </p>
                </div>
            </div>

            <header className="bg-blue-500 text-white py-4 px-4 flex items-center justify-between sticky top-0 z-10 w-full shadow-sm print:hidden">
                <h1 className="text-xl font-bold mx-auto">نتيجة التشخيص</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-4 text-white hover:text-blue-100 transition"
                >
                    <ArrowRight size={24} />
                </button>
            </header>

            <main className="flex-1 w-full max-w-md mx-auto flex flex-col">

                <div className="bg-linear-to-b from-[#fce4e4] to-[#fcf0f0] pt-10 pb-16 flex flex-col items-center">
                    <h2 className="text-3xl items-center font-bold text-gray-800 mb-8 px-4 text-center">{condition.name}</h2>

                    <div className="relative w-64 h-64 flex flex-col items-center justify-center drop-shadow-sm">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r={radius}
                                stroke="#f3f4f6"
                                strokeWidth={strokeWidth}
                                fill="transparent"
                            />
                            <circle
                                cx="128"
                                cy="128"
                                r={radius}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="relative z-10 flex flex-col items-center justify-center mt-2">
                            <span className={`text-6xl font-bold tracking-tighter ${textColor}`}>{percentage}%</span>
                            <span className="text-gray-500 mt-1 font-medium text-lg">النتيجة: {score}</span>
                        </div>
                    </div>

                    <div className={`mt-8 px-12 py-3 ${severityColor} text-white rounded-4xl font-bold text-xl shadow-lg ${shadowColor}`}>
                        {severityLabel}
                    </div>
                </div>

                <div className="px-4 relative top-[-30px] z-10 w-full mb-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
                        <div className="flex flex-row items-center gap-3 mb-4 w-full justify-start">
                            <div className="bg-teal-50 p-2 rounded-xl text-teal-600">
                                <Info size={22} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                الأعراض التي تناسب هذا المرض من التي اخترتها
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-start">
                            {matchedSymptoms.length > 0 ? (
                                matchedSymptoms.map((symptom, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-teal-50 text-teal-800 rounded-2xl text-sm font-semibold whitespace-nowrap"
                                    >
                                        {symptom}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 bg-gray-50 px-6 py-3 rounded-xl border border-dashed border-gray-200 w-full text-center text-sm">
                                    لم تُسجَّل أي أعراض من النموذج الخاص بهذا المرض ضمن الأعراض التي اخترتها.
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {diseaseFoodsMapping[condition.name] && (
                    <div className="px-4 relative top-[-30px] z-10 w-full mb-6">
                        <div className="bg-white rounded-2xl p-0 shadow-md border border-gray-100 overflow-hidden">
                            <div className="flex text-center text-sm sm:text-base font-bold text-white">
                                <div className="flex-1 bg-green-500 py-3 flex items-center justify-center gap-2">
                                    <CheckCircle2 size={18} />
                                    الأطعمة المفيدة
                                </div>
                                <div className="flex-1 bg-red-500 py-3 flex items-center justify-center gap-2">
                                    <XCircle size={18} />
                                    الأطعمة الضارة
                                </div>
                            </div>
                            <div className="flex divide-x divide-x-reverse divide-gray-100">
                                <div className="flex-1 p-5 bg-green-50/50">
                                    <ul className="space-y-3">
                                        {diseaseFoodsMapping[condition.name].beneficial.map((food, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-green-800 text-sm font-semibold">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                                                {food}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex-1 p-5 bg-red-50/50">
                                    <ul className="space-y-3">
                                        {diseaseFoodsMapping[condition.name].harmful.map((food, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-red-800 text-sm font-semibold">
                                                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                                                {food}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4 px-4 pb-6 mt-auto print:hidden">
                    <button
                        onClick={handlePrint}
                        className="w-full py-4 bg-white text-blue-700 font-bold rounded-2xl flex items-center justify-center gap-3 border-2 border-blue-100 hover:bg-blue-50 transition shadow-sm text-lg"
                    >
                        <Printer size={22} />
                        طباعة التقرير / تحميل PDF
                    </button>

                    <button
                        onClick={handleShare}
                        className="w-full py-4 bg-white text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-3 border-2 border-gray-100 hover:bg-gray-50 transition shadow-sm text-lg"
                    >
                        {copied ? <Check size={22} className="text-green-500" /> : <Share2 size={22} />}
                        {copied ? "تم النسخ!" : "مشاركة النتيجة"}
                    </button>

                    <button
                        onClick={() => {
                            sessionStorage.setItem("fromMedicalVisits", "true");
                            sessionStorage.setItem("medicalCondition", JSON.stringify(condition));
                            navigate("/doctor", { state: { condition } });
                        }}
                        className="w-full py-4 bg-white text-teal-600 font-bold rounded-2xl flex items-center justify-center gap-3 border-2 border-teal-100 hover:bg-teal-50 transition shadow-sm text-lg"
                    >
                        <ListChecks size={22} />
                        زيارات طبية
                    </button>

                    <button
                        onClick={() => navigate("/step5", { state: { condition } })}
                        className="w-full py-4 bg-linear-to-r from-teal-500 to-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition shadow-lg shadow-blue-500/30 text-lg"
                    >
                        <FileText size={22} />
                        عرض الشرح التفصيلي
                    </button>

                    <button
                        onClick={() => navigate("/step1")}
                        className="w-full py-4 bg-white text-blue-600 font-bold rounded-2xl flex items-center justify-center gap-3 border-2 border-blue-100 hover:bg-blue-50 transition text-lg"
                    >
                        <Home size={22} />
                        بدء تشخيص جديد
                    </button>
                </div>

            </main>
        </div>
    );
}

export default Step4Result;
