import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import logo from "../../public/logo.jpeg";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { user, login, API_URL } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/step1");
    }
  }, [user, navigate]);



  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!values.email.includes("@"))
      newErrors.email = "البريد الإلكتروني غير صالح";

    if (!values.password.trim())
      newErrors.password = "كلمة المرور مطلوبة";

    return newErrors;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();

    if (Object.keys(err).length === 0) {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth.php?action=login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email, password: values.password })
        });

        const data = await response.json();

        if (response.ok) {
          login(data.user);
          navigate("/step1");
        } else {
          setErrors({ email: data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        }
      } catch (error) {
        setErrors({ email: "تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً" });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">

      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-md">

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="logo" className="w-20 mb-2" />
          <h1 className="text-xl font-semibold text-blue-600">
            Stomach Support
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={values.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-700`}
            />
          </div>

          {/* Password field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="كلمة المرور"
              value={values.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-3 bg-gray-50 border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-700`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.email && (
            <p className="text-red-500 text-xs mt-2 text-right">{errors.email}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform active:scale-95 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "تسجيل الدخول"
            )}
          </button>



          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 font-semibold">
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;