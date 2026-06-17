import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, BriefcaseMedical, ThumbsUp, AlertTriangle, Pill, Microscope, Activity, ClipboardList, Printer } from "lucide-react";

function Step5Details() {
    const navigate = useNavigate();
    const location = useLocation();
    const condition = location.state?.condition || { name: "الحالة المحددة" };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#f8fafe] flex flex-col font-sans print:bg-white" dir="rtl">
            
            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block text-center mb-8 border-b-2 border-blue-500 pb-6 pt-4">
                <h1 className="text-4xl font-extrabold text-blue-800 mb-2">Stomach Support</h1>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">تفاصيل الخطة العلاجية المقترحة</h2>
                
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
                        <span className="font-bold text-gray-800">{condition.name}</span>
                    </p>
                </div>
            </div>

            <header className="bg-blue-500 text-white py-4 px-4 flex items-center justify-between sticky top-0 z-10 w-full shadow-sm print:hidden">
                <h1 className="text-xl font-bold mx-auto">شرح تفصيلي</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute right-4 text-white hover:text-blue-100 transition"
                >
                    <ArrowRight size={24} />
                </button>
            </header>

            <main className="flex-1 w-full max-w-md mx-auto p-4 space-y-5 pb-10">

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 w-full justify-between">
                        <h3 className="text-lg font-bold text-blue-900">المنطق الطبي</h3>
                        <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
                            <BriefcaseMedical size={24} />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-gray-700 text-center font-medium leading-relaxed">
                            بناءً على التشابه بين الأعراض التي تعاني منها وقاعدة بياناتنا الطبية، فإن الحالة الأقرب تطابقاً هي <strong className="text-blue-700">{condition.name}</strong>. يرجى ملاحظة أن وجود هذه الأعراض قد يكون ناتجاً عن عوامل أخرى أيضاً.
                        </p>
                    </div>
                </div>

                {condition.treatment && (
                    <div className="bg-emerald-50 rounded-3xl p-6 shadow-sm border border-emerald-100">
                        <div className="flex items-center gap-3 mb-5 w-full justify-between">
                            <h3 className="text-lg font-bold text-emerald-900">الخطة الطبية المقترحة</h3>
                            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                                <ClipboardList size={24} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-emerald-50 flex items-start gap-4 shadow-sm hover:shadow-md transition">
                                <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 shrink-0">
                                    <Pill size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-1">العلاج المتوقع</h4>
                                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{condition.treatment}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-emerald-50 flex items-start gap-4 shadow-sm hover:shadow-md transition">
                                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 shrink-0">
                                    <Microscope size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-1">التحاليل والمنظار</h4>
                                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{condition.test}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-emerald-50 flex items-start gap-4 shadow-sm hover:shadow-md transition">
                                <div className="bg-rose-50 p-2.5 rounded-xl text-rose-600 shrink-0">
                                    <Activity size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-1">احتمالية الجراحة</h4>
                                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{condition.surgery}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-red-50 rounded-3xl p-6 shadow-sm border border-red-100">
                    <div className="flex items-center gap-3 mb-4 w-full justify-between">
                        <h3 className="text-lg font-bold text-red-900">التوصيات</h3>
                        <div className="bg-red-100 p-2 rounded-xl text-red-500">
                            <ThumbsUp size={24} className="transform rotate-180" />
                        </div>
                    </div>
                    <div className="bg-white/60 p-4 rounded-2xl border border-red-50">
                        <p className="text-gray-800 text-sm font-medium leading-loose">
                            <strong className="text-red-700 block mb-1">خطوة يُنصح بها بشدة:</strong>
                            يُرجى تحديد موعد مع طبيب أمراض الجهاز الهضمي في أقرب وقت ممكن للحصول على تشخيص دقيق وبدء خطة العلاج المناسبة لتخفيف أعراض حالة {condition.name}.
                        </p>
                    </div>
                </div>

                <div className="bg-orange-50 rounded-3xl p-6 shadow-sm border border-orange-100">
                    <div className="flex items-center gap-3 mb-4 w-full justify-between">
                        <h3 className="text-lg font-bold text-orange-900">إخلاء مسؤولية مهم</h3>
                        <div className="bg-orange-100 p-2 rounded-xl text-orange-500">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <div className="bg-white/60 p-4 rounded-2xl border border-orange-50">
                        <p className="text-gray-700 text-sm leading-relaxed text-justify">
                            تم تصميم نظام دعم القرارات الهضمية هذا لتوفير مؤشرات محتملة بناءً على الأعراض المدخلة، ولكنه لا يعتبر تشخيصاً طبياً نهائياً بأي حال من الأحوال. يجب استشارة طبيب مختص للحصول على تشخيص دقيق وخطة علاجية مناسبة.
                        </p>
                    </div>
                </div>

                <div className="mt-6 mb-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="w-full py-4 bg-white text-blue-700 font-bold rounded-2xl flex items-center justify-center gap-3 border-2 border-blue-100 hover:bg-blue-50 transition shadow-sm text-lg"
                    >
                        <Printer size={22} />
                        طباعة الخطة / تحميل PDF
                    </button>
                </div>

            </main>
        </div>
    );
}

export default Step5Details;
