import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import logo from "../../public/logo.jpeg";
import { useAuth } from "../context/AuthContext";

function Register() {

  const navigate = useNavigate();
  const { login, API_URL } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!values.username.trim())
      newErrors.username = "Username مطلوب";

    if (!values.email.includes("@"))
      newErrors.email = "Email غير صحيح";

    if (values.password.length < 6)
      newErrors.password = "Password لازم 6 حروف على الأقل";

    return newErrors;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    setErrors(err);

    if (Object.keys(err).length === 0) {
      setLoading(true);
      try {
        const avatarImg = Math.floor(Math.random() * 40) + 10;
        const response = await fetch(`${API_URL}/auth.php?action=register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: values.username, 
            email: values.email, 
            password: values.password,
            avatarImg: avatarImg
          })
        });

        const data = await response.json();

        if (response.ok) {
          login(data.user);
          navigate("/step1");
        } else {
          setErrors({ email: data.error || "فشل عملية التسجيل" });
        }
      } catch (error) {
        setErrors({ email: "تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">

      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-md">

        <div className="flex flex-col items-center mb-8">
          <img src={logo} className="w-20 mb-2" />
          <h1 className="text-xl font-semibold text-blue-600">
            Stomach Support
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={20} />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={values.username}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                errors.username ? "border-red-500" : "border-gray-200"
              } rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-700`}
            />
          </div>

          {/* Email field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
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
              placeholder="Password"
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
            className={`w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform active:scale-95 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'جاري التحميل...' : 'Create Account'}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;