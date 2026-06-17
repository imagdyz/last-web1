import React, { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie } from 'recharts';
import { useNavigate } from "react-router-dom";
import { 
    Users, FileText, Calendar, LogOut, Activity, Trash2, ShieldAlert, 
    Database, Plus, Link as LinkIcon, Trash, Search, LayoutDashboard, 
    Stethoscope, Clock, Bell, Settings, ChevronRight, UserPlus, TrendingUp, ArrowRight, Menu, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
    const { user, logout, API_URL, updateBookingStatus, adminNotifications, markAllRead } = useAuth();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    // ... (rest of states)
    const [stats, setStats] = useState({ totalUsers: 0, totalDiagnoses: 0, totalBookings: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const [allDiagnoses, setAllDiagnoses] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search States
    const [searchUsers, setSearchUsers] = useState("");
    const [searchDiagnoses, setSearchDiagnoses] = useState("");
    const [searchBookings, setSearchBookings] = useState("");

    // Medical Data State
    const [organs, setOrgans] = useState([]);
    const [symptoms, setSymptoms] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [mappings, setMappings] = useState([]);
    const [medicalLoading, setMedicalLoading] = useState(false);

    // Form states
    const [newOrgan, setNewOrgan] = useState("");
    const [newSymptom, setNewSymptom] = useState({ name: "", organ_id: "", is_red_flag: 0 });
    const [newCondition, setNewCondition] = useState({ name: "", description: "", surgery: "", test: "", treatment: "" });
    const [newMapping, setNewMapping] = useState({ condition_id: "", symptom_id: "" });

    const fetchAdminData = async () => {
        try {
            const response = await fetch(`${API_URL}/admin.php`);
            const data = await response.json();
            
            if (response.ok && data) {
                setStats(data.stats || { totalUsers: 0, totalDiagnoses: 0, totalBookings: 0 });
                setAllUsers(data.users || []);
                setAllDiagnoses(data.diagnoses || []);
                setAllBookings(data.bookings || []);
            } else {
                console.error("Admin data fetch error:", data?.error || "Unknown error");
            }
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMedicalData = async () => {
        setMedicalLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin_medical.php?action=get_all`);
            const data = await response.json();
            if (response.ok) {
                setOrgans(data.organs || []);
                setSymptoms(data.symptoms || []);
                setConditions(data.conditions || []);
                setMappings(data.mappings || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setMedicalLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate("/admin-login");
            return;
        }
        fetchAdminData();
        fetchMedicalData();
    }, [user, navigate, API_URL]);

    const handleLogout = () => {
        logout();
        navigate("/admin-login");
    };

    // Chart Data Processing
    const systemStatsData = useMemo(() => {
        return [
            { name: 'المستخدمين', count: stats.totalUsers || 0, color: '#6366f1' },
            { name: 'التشخيصات', count: stats.totalDiagnoses || 0, color: '#10b981' },
            { name: 'الحجوزات', count: stats.totalBookings || 0, color: '#f59e0b' }
        ];
    }, [stats]);

    const usersTimeline = useMemo(() => {
        const timeline = {};
        const sortedUsers = [...allUsers].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        
        sortedUsers.forEach(u => {
            if (!u.created_at) return;
            const dateStr = u.created_at.split(' ')[0];
            const date = new Date(dateStr).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
            timeline[date] = (timeline[date] || 0) + 1;
        });
        
        return Object.keys(timeline).map(key => ({ date: key, count: timeline[key] }));
    }, [allUsers]);

    // Medical Handlers
    const handleAddOrgan = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/admin_medical.php?action=add_organ`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newOrgan })
            });
            if (res.ok) { setNewOrgan(""); fetchMedicalData(); }
        } catch(e) { console.error(e); }
    };

    const handleDeleteOrgan = async (id) => {
        if (!window.confirm("حذف العضو سيحذف كل الأعراض المرتبطة به. هل أنت متأكد؟")) return;
        try {
            const res = await fetch(`${API_URL}/admin_medical.php?action=delete_organ&id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchMedicalData();
        } catch(e) { console.error(e); }
    };

    const handleAddSymptom = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/admin_medical.php?action=add_symptom`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSymptom)
            });
            if (res.ok) { setNewSymptom({ name: "", organ_id: "", is_red_flag: 0 }); fetchMedicalData(); }
        } catch(e) { console.error(e); }
    };

    const handleDeleteSymptom = async (id) => {
        if (!window.confirm("متأكد من حذف العرض؟")) return;
        try {
            const res = await fetch(`${API_URL}/admin_medical.php?action=delete_symptom&id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchMedicalData();
        } catch(e) { console.error(e); }
    };

    const handleAddCondition = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/admin_medical.php?action=add_condition`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCondition)
            });
            if (res.ok) { setNewCondition({ name: "", description: "", surgery: "", test: "", treatment: "" }); fetchMedicalData(); }
        } catch(e) { console.error(e); }
    };

    const handleDeleteCondition = async (id) => {
        if (!window.confirm("متأكد من حذف المرض؟")) return;
        try {
            const res = await fetch(`${API_URL}/admin_medical.php?action=delete_condition&id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchMedicalData();
        } catch(e) { console.error(e); }
    };

    const handleAddMapping = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/admin_medical.php?action=map_symptom`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMapping)
            });
            if (res.ok) { setNewMapping({ condition_id: "", symptom_id: "" }); fetchMedicalData(); }
        } catch(e) { console.error(e); }
    };

    const handleDeleteMapping = async (cid, sid) => {
        try {
            const res = await fetch(`${API_URL}/admin_medical.php?action=unmap_symptom&condition_id=${cid}&symptom_id=${sid}`, { method: 'DELETE' });
            if (res.ok) fetchMedicalData();
        } catch(e) { console.error(e); }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم وكل بياناته؟")) return;
        try {
            const res = await fetch(`${API_URL}/admin.php?action=delete_user&id=${userId}`, { method: 'DELETE' });
            if (res.ok) {
                setAllUsers(allUsers.filter(u => u.id !== userId));
                setStats(prev => ({...prev, totalUsers: prev.totalUsers - 1}));
            } else {
                alert("فشل حذف المستخدم");
            }
        } catch(e) {
            console.error(e);
        }
    };

    const handleDeleteDiagnosis = async (diagId) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا التشخيص؟")) return;
        try {
            const res = await fetch(`${API_URL}/admin.php?action=delete_diagnosis&id=${diagId}`, { method: 'DELETE' });
            if (res.ok) {
                setAllDiagnoses(allDiagnoses.filter(d => d.id !== diagId));
                setStats(prev => ({...prev, totalDiagnoses: prev.totalDiagnoses - 1}));
            } else {
                alert("فشل حذف التشخيص");
            }
        } catch(e) {
            console.error(e);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا الحجز؟")) return;
        try {
            const res = await fetch(`${API_URL}/admin.php?action=delete_booking&id=${bookingId}`, { method: 'DELETE' });
            if (res.ok) {
                setAllBookings(allBookings.filter(b => b.id !== bookingId));
                setStats(prev => ({...prev, totalBookings: prev.totalBookings - 1}));
            } else {
                alert("فشل حذف الحجز");
            }
        } catch(e) {
            console.error(e);
        }
    };

    // Filtered Data
    const filteredUsers = allUsers.filter(u => 
        (u.name || "").toLowerCase().includes(searchUsers.toLowerCase()) || 
        (u.email || "").toLowerCase().includes(searchUsers.toLowerCase())
    );
    const filteredDiagnoses = allDiagnoses.filter(d => 
        (d.user_name || "").toLowerCase().includes(searchDiagnoses.toLowerCase()) || 
        (d.condition_name || "").toLowerCase().includes(searchDiagnoses.toLowerCase())
    );
    const filteredBookings = allBookings.filter(b => 
        (b.user_name || "").toLowerCase().includes(searchBookings.toLowerCase()) || 
        (b.doctor_name || "").toLowerCase().includes(searchBookings.toLowerCase())
    );

    const menuItems = [
        { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
        { id: 'users', label: 'المستخدمون', icon: Users },
        { id: 'diagnoses', label: 'التشخيصات', icon: Stethoscope },
        { id: 'bookings', label: 'الحجوزات', icon: Clock },
        { id: 'medical', label: 'بيانات النظام', icon: Database },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans" dir="rtl">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <ShieldAlert className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={24} />
                    </div>
                    <p className="text-blue-100/60 font-medium animate-pulse text-lg">جاري تجهيز لوحة التحكم...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900" dir="rtl">
            
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar (Mobile + Desktop) */}
            <aside className={`
                fixed inset-y-0 right-0 z-[70] w-[85vw] max-w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 transform
                lg:translate-x-0 lg:static lg:h-screen
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4 sm:p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">STOMACH <span className="text-blue-500">ADMIN</span></h1>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Medical System v2.0</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 p-2">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                activeTab === item.id 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:text-blue-400'} />
                                <span className="font-bold text-sm">{item.label}</span>
                            </div>
                            {activeTab === item.id && <ChevronRight size={16} />}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                <Users size={18} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">حساب الإدارة</p>
                                <p className="text-sm font-bold truncate w-32">{user?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs"
                        >
                            <LogOut size={16} />
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors">
                             <Menu size={20} />
                        </button>
                        <h1 className="font-bold text-sm hidden xsm:block">لوحة التحكم</h1>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-6 text-slate-400 text-sm">
                        <button 
                            onClick={() => navigate("/doctor")}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold"
                        >
                            <ArrowRight size={18} />
                            العودة للموقع
                        </button>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <div className="flex items-center gap-2">
                            <LayoutDashboard size={16} />
                            <span>لوحة التحكم</span>
                            <ChevronRight size={14} />
                            <span className="text-slate-900 font-bold">{menuItems.find(m => m.id === activeTab)?.label}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 relative">
                        <button 
                            onClick={() => {
                                setIsNotifOpen(!isNotifOpen);
                                if (!isNotifOpen) markAllRead(true);
                            }}
                            className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition"
                        >
                            <Bell size={20} />
                            {adminNotifications.some(n => !n.read) && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h4 className="font-black text-sm">الإشعارات الإدارية</h4>
                                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                                        {adminNotifications.length} جديد
                                    </span>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {adminNotifications.length > 0 ? adminNotifications.map((n) => (
                                        <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                                    <Calendar size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900 mb-1">{n.title}</p>
                                                    <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{n.message}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                                                        {new Date(n.time).toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center">
                                            <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                                            <p className="text-xs text-slate-400 font-bold">لا توجد إشعارات حالياً</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-slate-50 text-center">
                                    <button 
                                        onClick={() => setIsNotifOpen(false)}
                                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                    >
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="w-px h-6 bg-slate-200 mx-1 sm:mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-left hidden sm:block">
                                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                                <p className="text-[10px] text-slate-400">مسؤول النظام</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                <img src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-3 sm:p-8 pb-12 max-w-[1600px] mx-auto w-full">
                    
                    {/* Tab: Overview */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* Hero Header */}
                            <div className="bg-gradient-to-l from-blue-700 to-indigo-600 rounded-3xl p-4 sm:p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-xl sm:text-3xl font-black mb-2">أهلاً بك مجدداً، {user?.name?.split(' ')[0] || 'المسؤول'}! 👋</h2>
                                    <p className="text-blue-100 max-w-md">لديك {stats.totalBookings} حجز جديد اليوم. يمكنك متابعة كافة الإحصائيات وإدارة النظام من هنا.</p>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                                        <button onClick={() => setActiveTab('medical')} className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition">إدارة البيانات</button>
                                        <button onClick={() => setActiveTab('users')} className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition border border-blue-400/30">المستخدمين</button>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-10 scale-150 transform rotate-12 pointer-events-none">
                                    <Activity size={300} />
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                <StatCard 
                                    title="إجمالي المستخدمين" 
                                    value={stats.totalUsers} 
                                    icon={Users} 
                                    color="indigo" 
                                    trend="+12%" 
                                />
                                <StatCard 
                                    title="إجمالي التشخيصات" 
                                    value={stats.totalDiagnoses} 
                                    icon={Stethoscope} 
                                    color="emerald" 
                                    trend="+8%" 
                                />
                                <StatCard 
                                    title="إجمالي الحجوزات" 
                                    value={stats.totalBookings} 
                                    icon={Calendar} 
                                    color="amber" 
                                    trend="+24%" 
                                />
                                <StatCard 
                                    title="معدل النشاط" 
                                    value="98.5%" 
                                    icon={Activity} 
                                    color="rose" 
                                    trend="+2.1%" 
                                />
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                                        <div>
                                            <h3 className="text-xl font-black">نمو المستخدمين</h3>
                                            <p className="text-slate-400 text-sm">معدل تسجيل المستخدمين الجدد خلال الفترة الأخيرة</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                                                <TrendingUp size={14} /> مرتفع
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[350px]" dir="ltr">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={usersTimeline}>
                                                <defs>
                                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis 
                                                    dataKey="date" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{fill: '#94a3b8', fontSize: 12}} 
                                                    dy={10}
                                                />
                                                <YAxis 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{fill: '#94a3b8', fontSize: 12}} 
                                                    dx={-10}
                                                />
                                                <RechartsTooltip 
                                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                                                />
                                                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm flex flex-col">
                                    <h3 className="text-xl font-black mb-8">توزيع البيانات</h3>
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <div className="h-[250px] w-full" dir="ltr">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={systemStatsData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="count"
                                                    >
                                                        {systemStatsData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="w-full space-y-4 mt-6">
                                            {systemStatsData.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                                                        <span className="text-sm font-bold text-slate-600">{item.name}</span>
                                                    </div>
                                                    <span className="text-sm font-black text-slate-900">{item.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Users */}
                    {activeTab === 'users' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-2xl font-black mb-1">إدارة المستخدمين</h2>
                                        <p className="text-slate-400 text-sm">لديك إجمالي {allUsers.length} مستخدم مسجل في النظام</p>
                                    </div>
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute right-4 top-3.5 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            placeholder="ابحث عن مستخدم بالاسم أو البريد..." 
                                            value={searchUsers}
                                            onChange={(e) => setSearchUsers(e.target.value)}
                                            className="w-full pl-6 pr-12 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead>
                                            <tr className="text-slate-400 text-xs uppercase tracking-widest font-black">
                                                <th className="px-4 sm:px-8 py-5">المستخدم</th>
                                                <th className="px-4 sm:px-8 py-5">البريد الإلكتروني</th>
                                                <th className="px-4 sm:px-8 py-5">تاريخ الانضمام</th>
                                                <th className="px-4 sm:px-8 py-5 text-center">إجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                                <tr key={u.id} className="hover:bg-slate-50 transition group">
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm">
                                                                {u.name.charAt(0)}
                                                            </div>
                                                            <span className="font-bold text-slate-900">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <span className="text-slate-500 font-medium" dir="ltr">{u.email}</span>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <span className="text-slate-400 text-sm font-bold">
                                                            {new Date(u.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5 text-center">
                                                        <button 
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="px-8 py-20 text-center">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <Users size={64} className="text-slate-200" />
                                                            <p className="text-slate-400 font-bold">لم يتم العثور على أي مستخدمين</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Diagnoses */}
                    {activeTab === 'diagnoses' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-2xl font-black mb-1">سجل التشخيصات</h2>
                                        <p className="text-slate-400 text-sm">متابعة كافة الفحوصات والنتائج التي أجراها المستخدمون</p>
                                    </div>
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
                                        <input 
                                            type="text" 
                                            placeholder="بحث عن مريض أو مرض..." 
                                            value={searchDiagnoses}
                                            onChange={(e) => setSearchDiagnoses(e.target.value)}
                                            className="w-full pl-6 pr-12 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead>
                                            <tr className="text-slate-400 text-xs uppercase tracking-widest font-black">
                                                <th className="px-4 sm:px-8 py-5">المريض</th>
                                                <th className="px-4 sm:px-8 py-5">التشخيص الطبي</th>
                                                <th className="px-4 sm:px-8 py-5">نسبة التطابق</th>
                                                <th className="px-4 sm:px-8 py-5">التاريخ والوقت</th>
                                                <th className="px-4 sm:px-8 py-5 text-center">إجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredDiagnoses.length > 0 ? filteredDiagnoses.map((diag) => (
                                                <tr key={diag.id} className="hover:bg-slate-50 transition">
                                                    <td className="px-4 sm:px-8 py-5">
                                                        {diag.user_name ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                                                    <Users size={16} className="text-slate-600" />
                                                                </div>
                                                                <span className="font-bold text-slate-900">{diag.user_name}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-slate-300 italic">
                                                                <UserPlus size={16} />
                                                                <span>مستخدم محذوف</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <span className="font-black text-slate-900">{diag.condition_name}</span>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full transition-all duration-1000 ${
                                                                        diag.match_percentage >= 75 ? 'bg-rose-500' :
                                                                        diag.match_percentage >= 40 ? 'bg-amber-500' :
                                                                        'bg-emerald-500'
                                                                    }`}
                                                                    style={{width: `${diag.match_percentage}%`}}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-black text-slate-600">{diag.match_percentage}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <span className="text-slate-400 text-sm font-bold">
                                                            {diag.diagnosis_date ? new Date(diag.diagnosis_date).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5 text-center">
                                                        <button 
                                                            onClick={() => handleDeleteDiagnosis(diag.id)}
                                                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-20 text-center">
                                                        <p className="text-slate-400 font-bold">لا يوجد تشخيصات مسجلة</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Bookings */}
                    {activeTab === 'bookings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-2xl font-black mb-1">إدارة المواعيد</h2>
                                        <p className="text-slate-400 text-sm">مراجعة وحذف حجوزات المرضى مع الأطباء</p>
                                    </div>
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
                                        <input 
                                            type="text" 
                                            placeholder="بحث عن مريض أو طبيب..." 
                                            value={searchBookings}
                                            onChange={(e) => setSearchBookings(e.target.value)}
                                            className="w-full pl-6 pr-12 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead>
                                            <tr className="text-slate-400 text-xs uppercase tracking-widest font-black">
                                                <th className="px-4 sm:px-8 py-5">المريض</th>
                                                <th className="px-4 sm:px-8 py-5">الطبيب</th>
                                                <th className="px-4 sm:px-8 py-5">الموعد المطلوب</th>
                                                <th className="px-4 sm:px-8 py-5">الحالة</th>
                                                <th className="px-4 sm:px-8 py-5 text-center">إجراءات الإدارة</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredBookings.length > 0 ? filteredBookings.map((b) => (
                                                <tr key={b.id} className="hover:bg-slate-50 transition">
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <span className="font-bold text-slate-900">{b.user_name || 'مستخدم محذوف'}</span>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">د</div>
                                                            <span className="font-bold text-blue-600">{b.doctor_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-slate-900">{b.bookedDate}</span>
                                                            <span className="text-xs text-slate-400">{b.bookedTime}</span>
                                                            {b.alternativeTime && (
                                                                <span className="text-[10px] text-blue-600 font-bold mt-1 bg-blue-50 px-2 py-0.5 rounded-full inline-block w-fit">
                                                                    مقترح: {b.alternativeTime}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        {b.status === 'confirmed' ? (
                                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100">مؤكد</span>
                                                        ) : b.status === 'suggested' ? (
                                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100">تم اقتراح موعد</span>
                                                        ) : (
                                                            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100">بانتظار الموافقة</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {b.status !== 'confirmed' && (
                                                                <button 
                                                                    onClick={async () => {
                                                                        const ok = await updateBookingStatus(b.id, 'confirmed');
                                                                        if (ok) fetchAdminData();
                                                                    }}
                                                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
                                                                >
                                                                    قبول
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={async () => {
                                                                    const newTime = window.prompt("ادخل الموعد الجديد المقترح (مثلاً: الأحد القادم الساعة 4 مساءً):");
                                                                    if (newTime) {
                                                                        const ok = await updateBookingStatus(b.id, 'suggested', newTime);
                                                                        if (ok) fetchAdminData();
                                                                    }
                                                                }}
                                                                className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-sm"
                                                            >
                                                                اقتراح موعد
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteBooking(b.id)}
                                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                title="حذف الحجز"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-20 text-center">
                                                        <p className="text-slate-400 font-bold">لا توجد حجوزات نشطة</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Medical Data */}
                    {activeTab === 'medical' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* Sections with improved UI */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                
                                {/* Organs Section */}
                                <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                            <Database size={24} />
                                        </div>
                                        <h2 className="text-2xl font-black">إدارة أجزاء الجسم</h2>
                                    </div>
                                    <form onSubmit={handleAddOrgan} className="flex flex-col sm:flex-row gap-4 mb-8">
                                        <input 
                                            type="text" 
                                            value={newOrgan} 
                                            onChange={e => setNewOrgan(e.target.value)} 
                                            placeholder="اسم العضو (مثال: القولون)" 
                                            className="flex-1 px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-medium" 
                                            required 
                                        />
                                        <button type="submit" className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/20 transition-all">
                                            <Plus size={20}/> إضافة
                                        </button>
                                    </form>
                                    <div className="flex flex-wrap gap-3 max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                                        {organs.map(o => (
                                            <div key={o.id} className="bg-white px-5 py-3 rounded-2xl border border-slate-200 flex items-center gap-4 hover:border-indigo-200 transition-all group">
                                                <span className="font-bold text-slate-700">{o.name}</span>
                                                <button onClick={() => handleDeleteOrgan(o.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Symptoms Section */}
                                <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                            <Activity size={24} />
                                        </div>
                                        <h2 className="text-2xl font-black">إدارة الأعراض</h2>
                                    </div>
                                    <form onSubmit={handleAddSymptom} className="space-y-4 mb-8">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <input 
                                                type="text" 
                                                value={newSymptom.name} 
                                                onChange={e => setNewSymptom({...newSymptom, name: e.target.value})} 
                                                placeholder="اسم العرض..." 
                                                className="flex-1 px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-500 font-medium" 
                                                required 
                                            />
                                            <select 
                                                value={newSymptom.organ_id} 
                                                onChange={e => setNewSymptom({...newSymptom, organ_id: e.target.value})} 
                                                className="px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-500 font-bold text-sm" 
                                                required
                                            >
                                                <option value="">اختر العضو...</option>
                                                {organs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                            </select>
                                        </div>
                                        <button type="submit" className="w-full bg-amber-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-600 font-bold shadow-lg shadow-amber-500/20 transition-all">
                                            <Plus size={20}/> إضافة عرض جديد
                                        </button>
                                    </form>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                                        {symptoms.map(s => (
                                            <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center group hover:border-amber-200 transition-all">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                                                    <p className="text-[10px] text-amber-600 font-black uppercase tracking-wider">{s.organ_name}</p>
                                                </div>
                                                <button onClick={() => handleDeleteSymptom(s.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Conditions & Mapping - Full Width */}
                            <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black">إدارة الأمراض والربط</h2>
                                        <p className="text-slate-400 text-sm">إضافة الأمراض الجديدة وربطها بالأعراض المناسبة</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                    <div>
                                        <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                            <Plus size={20} className="text-emerald-500" /> إضافة مرض جديد
                                        </h3>
                                        <form onSubmit={handleAddCondition} className="space-y-4 bg-slate-50 p-4 sm:p-8 rounded-[24px] border border-slate-100">
                                            <input 
                                                type="text" 
                                                value={newCondition.name} 
                                                onChange={e => setNewCondition({...newCondition, name: e.target.value})} 
                                                placeholder="اسم المرض..." 
                                                className="w-full px-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold" 
                                                required 
                                            />
                                            <textarea 
                                                value={newCondition.description} 
                                                onChange={e => setNewCondition({...newCondition, description: e.target.value})} 
                                                placeholder="وصف المرض وتفاصيله..." 
                                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 h-32 text-sm font-medium"
                                            ></textarea>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <input type="text" value={newCondition.treatment} onChange={e => setNewCondition({...newCondition, treatment: e.target.value})} placeholder="العلاج المقترح" className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" />
                                                <input type="text" value={newCondition.test} onChange={e => setNewCondition({...newCondition, test: e.target.value})} placeholder="الفحوصات" className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" />
                                                <input type="text" value={newCondition.surgery} onChange={e => setNewCondition({...newCondition, surgery: e.target.value})} placeholder="جراحة؟" className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" />
                                            </div>
                                            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 font-black shadow-lg shadow-emerald-600/20 transition-all mt-4">
                                                حفظ البيانات
                                            </button>
                                        </form>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                            <LinkIcon size={20} className="text-blue-500" /> ربط الأعراض
                                        </h3>
                                        <form onSubmit={handleAddMapping} className="flex flex-col gap-6 bg-blue-50 p-4 sm:p-8 rounded-[24px] border border-blue-100">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-blue-600 uppercase tracking-widest">اختر المرض</label>
                                                <select 
                                                    value={newMapping.condition_id} 
                                                    onChange={e => setNewMapping({...newMapping, condition_id: e.target.value})} 
                                                    className="w-full px-6 py-3.5 bg-white border border-blue-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold" 
                                                    required
                                                >
                                                    <option value="">-- اختر من القائمة --</option>
                                                    {conditions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-blue-600 uppercase tracking-widest">اختر العرض</label>
                                                <select 
                                                    value={newMapping.symptom_id} 
                                                    onChange={e => setNewMapping({...newMapping, symptom_id: e.target.value})} 
                                                    className="w-full px-6 py-3.5 bg-white border border-blue-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold" 
                                                    required
                                                >
                                                    <option value="">-- اختر من القائمة --</option>
                                                    {symptoms.map(s => <option key={s.id} value={s.id}>{s.name} ({s.organ_name})</option>)}
                                                </select>
                                            </div>
                                            <button type="submit" className="bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                                                تنفيذ الربط
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="mt-12 space-y-4">
                                    <h3 className="text-lg font-black mb-6">قائمة الأمراض والروابط النشطة</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                        {conditions.map(c => {
                                            const c_mappings = mappings.filter(m => parseInt(m.condition_id) === parseInt(c.id));
                                            return (
                                                <div key={c.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                                    <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                                                        <h4 className="font-black text-slate-900">{c.name}</h4>
                                                        <button onClick={() => handleDeleteCondition(c.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                            <Trash size={18}/>
                                                        </button>
                                                    </div>
                                                    <div className="p-6">
                                                        <div className="flex flex-wrap gap-2">
                                                            {c_mappings.length > 0 ? c_mappings.map(m => {
                                                                const symp = symptoms.find(s => parseInt(s.id) === parseInt(m.symptom_id));
                                                                if(!symp) return null;
                                                                return (
                                                                    <div key={m.symptom_id} className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black border border-blue-100 flex items-center gap-2">
                                                                        {symp.name}
                                                                        <button onClick={() => handleDeleteMapping(c.id, symp.id)} className="hover:text-red-500">
                                                                            <Trash2 size={12}/>
                                                                        </button>
                                                                    </div>
                                                                )
                                                            }) : <span className="text-slate-300 text-xs italic">لا توجد أعراض مرتبطة</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600",
    };

    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col gap-4 relative group hover:scale-[1.02] transition-all duration-300">
            <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mb-2 shadow-sm`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-slate-400 text-sm font-bold mb-1">{title}</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
                    <span className="text-emerald-500 text-xs font-black bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
                </div>
            </div>
            <div className="absolute top-8 left-8 text-slate-50 opacity-0 group-hover:opacity-10 transition-opacity">
                <Icon size={80} />
            </div>
        </div>
    );
}

export default AdminDashboard;

