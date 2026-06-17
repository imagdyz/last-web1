import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldAlert, ChevronLeft, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { login, API_URL } = useAuth();

  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role === 'admin') {
          login(data.user);
          navigate("/admin");
        } else {
          setError("عذراً، هذا الحساب غير مصرح له بدخول لوحة الإدارة");
        }
      } else {
        setError(data.error || "بيانات الاعتماد غير صالحة");
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم الرئيسي");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold"
        >
          <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ArrowRight size={16} />
          </div>
          العودة للرئيسية
        </button>

        {/* Card */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden relative group">
          
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-blue-600 via-indigo-500 to-transparent"></div>

          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <ShieldAlert size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">STOMACH <span className="text-blue-500">ADMIN</span></h1>
            <p className="text-slate-400 font-medium text-sm">تسجيل دخول المسؤولين فقط</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={values.email}
                  onChange={handleChange}
                  className="w-full pr-12 pl-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-bold placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full pr-12 pl-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-bold placeholder-slate-600"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-bold text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-600/20 flex justify-center items-center gap-3 group mt-4 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  دخول آمن
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              محمي بواسطة نظام التشفير المتقدم &copy; 2026
            </p>
          </div>
        </div>

        {/* Floating Decorative Text */}
        <p className="text-center mt-8 text-slate-600 text-xs font-medium">
          هذا النظام مخصص للأغراض الطبية الرسمية فقط
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;

