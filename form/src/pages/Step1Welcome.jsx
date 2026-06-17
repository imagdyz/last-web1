import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, CheckSquare, BriefcaseMedical, BarChart2, FileText, Play, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Step1Welcome() {
  const navigate = useNavigate();
  const { user, logout, getDiagnoses } = useAuth();
  const lastDiagnosis = getDiagnoses()[0] || null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f8fafe] flex flex-col font-sans" dir="rtl">
      <header className="bg-blue-500 text-white py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">نظام دعم القرارات الهضمية</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-100 text-sm font-medium hidden sm:block">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-white hover:text-blue-100 transition"
          >
            <LogOut size={24} className="transform rotate-180" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-md w-full mx-auto space-y-6">

        <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-2xl backdrop-blur-sm">
            <BriefcaseMedical size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mt-8 mb-4">مرحباً</h2>
          <p className="text-blue-50/90 leading-relaxed text-sm">
            نظام دعم قرارات هضمية احترافي. ابدأ باختيار أعراض المريض، ثم قم بتقييم الحالات ذات الصلة باستخدام خوارزمية التسجيل المرجحة لدينا.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">بدء التشخيص</h3>
            <div className="bg-blue-50 p-2 rounded-2xl text-blue-500">
              <Play size={24} className="fill-current" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            ابدأ باختيار أعراض المريض، ثم سيقترح النظام الحالات ذات الصلة...
          </p>
          <button
            onClick={() => navigate("/step2")}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
          >
            بدء التقييم
            <span className="text-xl mr-2">←</span>
          </button>

          <button
            onClick={() => navigate("/doctor")}
            className="w-full mt-4 py-4 bg-white text-blue-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition border-2 border-blue-500 shadow-sm"
          >
            حجز موعد  
            <BriefcaseMedical size={20} className="mr-2" />
          </button>
        </div>

        {/* Last diagnosis card */}
        {lastDiagnosis && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-teal-100 p-2 rounded-xl text-teal-600">
                <Activity size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">آخر تشخيص</h3>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
              <div>
                <p className="font-bold text-gray-800">{lastDiagnosis.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(lastDiagnosis.date).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                lastDiagnosis.match >= 75 ? "text-red-500 bg-red-50" :
                lastDiagnosis.match >= 40 ? "text-orange-500 bg-orange-50" :
                "text-green-600 bg-green-50"
              }`}>
                {lastDiagnosis.match}%
              </span>
            </div>
          </div>
        )}

        <div className="bg-[#f0f7ff] rounded-3xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-full text-blue-500">
              <span className="text-xl font-bold block w-6 h-6 text-center leading-6">i</span>
            </div>
            <h3 className="text-lg font-bold text-blue-800">كيف يعمل</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-500">
                <CheckSquare size={20} />
              </div>
              <p className="text-gray-700 text-sm font-medium">1. اختر أعراض المريض من القائمة الشاملة</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-teal-100 p-2 rounded-xl text-teal-600">
                <BriefcaseMedical size={20} />
              </div>
              <p className="text-gray-700 text-sm font-medium">2. يقترح النظام الحالات ذات الصلة للتقييم</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-2 rounded-xl text-orange-500">
                <BarChart2 size={20} />
              </div>
              <p className="text-gray-700 text-sm font-medium">3. احصل على تقييم احتمالي مرجح</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-2 rounded-xl text-green-600">
                <FileText size={20} />
              </div>
              <p className="text-gray-700 text-sm font-medium">4. راجع الشرح الطبي التفصيلي والتوصيات</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Step1Welcome;
