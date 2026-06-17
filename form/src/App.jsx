import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

import Step1Welcome from "./pages/Step1Welcome";
import Step2Skeleton from "./pages/Step2Skeleton";
import Step2Symptoms from "./pages/Step2Symptoms";
import Step3Conditions from "./pages/Step3Conditions";
import Step4Result from "./pages/Step4Result";
import Step5Details from "./pages/Step5Details";

import DoctorHome from "./pages/DoctorHome";
import DoctorList from "./pages/DoctorList";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import BookingConfirmation from "./pages/BookingConfirmation";
import ChatBot from "./pages/ChatBot";
import AudioCall from "./pages/AudioCall";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import MyAppointments from "./pages/MyAppointments";
import SplashScreen from "./components/SplashScreen";
import { useState, useEffect } from "react";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 seconds splash
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <AuthProvider>
      <BrowserRouter>
        <ChatBot />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected - Admin */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Protected - Diagnosis */}
          <Route path="/step1" element={<ProtectedRoute><Step1Welcome /></ProtectedRoute>} />
          <Route path="/step2-skeleton" element={<ProtectedRoute><Step2Skeleton /></ProtectedRoute>} />
          <Route path="/step2" element={<ProtectedRoute><Step2Symptoms /></ProtectedRoute>} />
          <Route path="/step3" element={<ProtectedRoute><Step3Conditions /></ProtectedRoute>} />
          <Route path="/step4" element={<ProtectedRoute><Step4Result /></ProtectedRoute>} />
          <Route path="/step5" element={<ProtectedRoute><Step5Details /></ProtectedRoute>} />

          {/* Protected - Doctor */}
          <Route path="/doctor/home" element={<ProtectedRoute><DoctorHome /></ProtectedRoute>} />
          <Route path="/doctor" element={<Navigate to="/doctor/home" replace />} />
          <Route path="/doctor/list" element={<ProtectedRoute><DoctorList /></ProtectedRoute>} />
          <Route path="/doctor/profile/:id" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
          <Route path="/doctor/my-appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
          <Route path="/doctor/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/doctor/book/:id" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/doctor/booking-confirm" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
          <Route path="/doctor/audio-call/:id" element={<ProtectedRoute><AudioCall /></ProtectedRoute>} />

          {/* Protected - User */}
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          <Route path="/form" element={<Navigate to="/register" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
