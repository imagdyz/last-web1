import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

/** API base without trailing slash. Dev: XAMPP default. Prod: VITE_API_URL or same-origin /backend/api */
function resolveApiBase() {
    const fromEnv = import.meta.env.VITE_API_URL;
    if (typeof fromEnv === "string" && fromEnv.trim()) {
        return fromEnv.replace(/\/$/, "");
    }
    if (import.meta.env.DEV) {
        return "http://localhost/backend/api";
    }
    if (typeof window !== "undefined" && window.location?.origin) {
        return `${window.location.origin}/backend/api`;
    }
    return "";
}

const API_URL = resolveApiBase();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("auth_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [bookings, setBookings] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [adminNotifications, setAdminNotifications] = useState([]);
    const [medicalData, setMedicalData] = useState(null);

    // Fetch medical data once on mount
    useEffect(() => {
        const fetchMedicalData = async () => {
            try {
                const res = await fetch(`${API_URL}/medical_data.php`);
                const data = await res.json();
                if (res.ok) {
                    setMedicalData(data);
                }
            } catch (error) {
                console.error("Failed to fetch medical data:", error);
            }
        };
        fetchMedicalData();
    }, []);

    // Fetch data whenever user changes
    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setBookings([]);
            setDiagnoses([]);
            setNotifications([]);
            setAdminNotifications([]);
        }
    }, [user]);

    const fetchData = async () => {
        if (!user?.id) return;
        try {
            const endpoints = [
                fetch(`${API_URL}/bookings.php?user_id=${user.id}`),
                fetch(`${API_URL}/diagnoses.php?user_id=${user.id}`),
                fetch(`${API_URL}/notifications.php?user_id=${user.id}`)
            ];

            if (user.role === 'admin') {
                endpoints.push(fetch(`${API_URL}/notifications.php?user_id=${user.id}&is_admin=true`));
            }

            const results = await Promise.all(endpoints);
            const data = await Promise.all(results.map(r => r.json()));

            setBookings(Array.isArray(data[0]) ? data[0] : []);
            setDiagnoses(Array.isArray(data[1]) ? data[1] : []);
            setNotifications(Array.isArray(data[2]) ? data[2] : []);
            if (user.role === 'admin') {
                setAdminNotifications(Array.isArray(data[3]) ? data[3] : []);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const login = (userData) => {
        localStorage.setItem("auth_user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("auth_user");
        sessionStorage.removeItem("fromMedicalVisits");
        sessionStorage.removeItem("medicalCondition");
        setUser(null);
    };

    // helpers for bookings
    const saveBooking = async (booking) => {
        if (!user?.id) return;
        try {
            const res = await fetch(`${API_URL}/bookings.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...booking, user_id: user.id, status: 'pending' })
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error("Failed to save booking:", error);
        }
    };

    const updateBookingStatus = async (bookingId, status, alternativeTime = null) => {
        try {
            const res = await fetch(`${API_URL}/bookings.php?action=update_status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: bookingId, status, alternativeTime, actor_role: user?.role || 'user' })
            });
            if (res.ok) {
                if (user) fetchData();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to update booking status:", error);
            return false;
        }
    };

    const getBookings = () => bookings;

    // helpers for diagnoses
    const saveDiagnosis = async (diagnosis) => {
        if (!user?.id) return;
        try {
            const res = await fetch(`${API_URL}/diagnoses.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    condition: { name: diagnosis.name, match: diagnosis.match },
                    symptoms: diagnosis.symptoms || [],
                    user_id: user.id,
                    date: new Date().toISOString()
                })
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error("Failed to save diagnosis:", error);
        }
    };

    const getDiagnoses = () => diagnoses;

    // notifications
    const addNotification = async (notif) => {
        if (!user?.id) return;
        try {
            const res = await fetch(`${API_URL}/notifications.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...notif, user_id: user.id })
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error("Failed to add notification:", error);
        }
    };

    const getNotifications = () => notifications;

    const markAllRead = async (isAdmin = false) => {
        if (!user?.id) return;
        try {
            const res = await fetch(`${API_URL}/notifications.php?user_id=${user.id}&action=read_all${isAdmin ? '&is_admin=true' : ''}`, {
                method: 'POST'
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error("Failed to mark all read:", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, saveBooking, updateBookingStatus, getBookings,
            saveDiagnosis, getDiagnoses, addNotification, getNotifications,
            adminNotifications, markAllRead, API_URL, medicalData
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
