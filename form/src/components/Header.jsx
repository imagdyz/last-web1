import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Brand Hub</span>
            <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">B</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">الرئيسية</Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">عن المنصة</Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">المميزات</Link>
          </nav>

          {/* Login CTA */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm hidden sm:inline">هل لديك حساب؟</span>
            <Link
              to="/login"
              className="text-purple-600 font-semibold text-sm hover:underline"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
